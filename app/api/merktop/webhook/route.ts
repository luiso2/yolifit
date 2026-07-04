import { NextResponse } from 'next/server';
import { verifyMerktopSignature } from '@/lib/merktop-webhook';
import { markBookingPaid, markBookingCanceled, wasEventProcessed, markEventProcessed } from '@/lib/db';

export async function POST(req: Request) {
  const rawBody = await req.text();
  const secret = process.env.MERKTOP_WEBHOOK_SECRET ?? '';
  if (!secret) {
    return NextResponse.json({ error: 'not_configured' }, { status: 500 });
  }
  const ok = verifyMerktopSignature({
    secret,
    rawBody,
    signatureHeader: req.headers.get('merktop-signature'),
    nowSec: Math.floor(Date.now() / 1000),
  });
  if (!ok) return NextResponse.json({ error: 'bad_signature' }, { status: 401 });

  const eventId = req.headers.get('merktop-event-id') ?? '';

  try {
    if (eventId && (await wasEventProcessed(eventId))) return NextResponse.json({ ok: true });

    let event: { type?: string; data?: { ref?: string | null; deposit_id?: string | null } };
    try { event = JSON.parse(rawBody); } catch { return NextResponse.json({ ok: true }); }
    const ref = event.data?.ref ?? null;

    if (ref) {
      if (event.type === 'deposit.paid') {
        await markBookingPaid(ref, event.data?.deposit_id ?? null);
      } else if (event.type === 'deposit.refunded' || event.type === 'deposit.expired') {
        await markBookingCanceled(ref);
      }
      // Other event types (booking.rescheduled/updated/deleted, ping) are acknowledged only.
    }

    if (eventId) await markEventProcessed(eventId);
    return NextResponse.json({ ok: true });
  } catch {
    // DB error: return 500 (not 200) so Merktop's webhook sender retries delivery.
    return NextResponse.json({ error: 'db_error' }, { status: 500 });
  }
}
