import { NextResponse } from 'next/server';
import { giftCardBuySchema } from '@/lib/gift-card-schema';
import { MERKTOP_WORKER_URL, MERKTOP_BUSINESS_ID } from '@/lib/merktop';

// Server-side proxy: validates the buy request, injects Yoly's business_id, and
// forwards to Merktop's public gift-card buy endpoint. Keeps the worker URL off
// the client and maps worker errors to stable codes the form can translate.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = giftCardBuySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }
  const d = parsed.data;
  try {
    const res = await fetch(`${MERKTOP_WORKER_URL}/pub/gift-cards/buy`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        business_id: MERKTOP_BUSINESS_ID,
        amount: d.amount,
        buyer_name: d.buyer_name,
        buyer_email: d.buyer_email,
        recipient_name: d.recipient_name ?? null,
        recipient_email: d.recipient_email ?? null,
        message: d.message ?? null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.url) {
      return NextResponse.json({ url: data.url });
    }
    if (res.status === 409) {
      return NextResponse.json({ error: 'not_ready' }, { status: 409 });
    }
    return NextResponse.json({ error: 'checkout_failed' }, { status: 502 });
  } catch {
    return NextResponse.json({ error: 'checkout_failed' }, { status: 502 });
  }
}
