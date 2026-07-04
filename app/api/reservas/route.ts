import { NextResponse } from 'next/server';
import { bookingSchema } from '@/lib/booking-schema';
import { getSpaServices } from '@/lib/services';
import { durationMinutes } from '@/lib/duration';
import { generateBookingRef } from '@/lib/booking-ref';
import { computeAvailableSlots } from '@/lib/availability';
import { createBooking, paidBookingsForDate } from '@/lib/db';
import { baseSlots } from '@/lib/slots';

function nyOffsetMinutes(dateISO: string): number {
  // Real offset of America/New_York on that date (e.g. -240 EDT, -300 EST), in minutes.
  const d = new Date(`${dateISO}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', timeZoneName: 'shortOffset', hour: '2-digit', hour12: false,
  }).formatToParts(d);
  const tz = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT-5';
  const m = tz.match(/GMT([+-]\d{1,2})(?::?(\d{2}))?/);
  return m ? parseInt(m[1], 10) * 60 + (m[1].startsWith('-') ? -1 : 1) * (m[2] ? parseInt(m[2], 10) : 0) : -300;
}
// Combine a YYYY-MM-DD date and a "10:30 AM" slot into an absolute instant,
// interpreting the wall-clock time as America/New_York (Miami), using the
// real per-date offset (EST/EDT) so it matches paidBookingsForDate's
// `AT TIME ZONE 'America/New_York'` read path across the DST boundary.
function slotToStartsAt(dateISO: string, time: string): Date {
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return new Date(`${dateISO}T12:00:00Z`);
  let hour = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === 'PM') hour += 12;
  const off = nyOffsetMinutes(dateISO);
  const sign = off <= 0 ? '-' : '+';
  const abs = Math.abs(off);
  const oh = String(Math.floor(abs / 60)).padStart(2, '0');
  const om = String(abs % 60).padStart(2, '0');
  const hh = String(hour).padStart(2, '0');
  return new Date(`${dateISO}T${hh}:${m[2]}:00${sign}${oh}:${om}`);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const locale = body?.locale === 'en' ? 'en' : 'es';
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: locale === 'en' ? 'Invalid booking data' : 'Datos de reserva invalidos' },
      { status: 400 },
    );
  }
  const data = parsed.data;
  const service = getSpaServices(locale).find((s) => s.id === data.serviceId);
  if (!service) {
    return NextResponse.json(
      { error: locale === 'en' ? 'Service not found' : 'Servicio no encontrado' },
      { status: 400 },
    );
  }
  // Server-side slot validation: reject any time not on the published weekly
  // schedule for that date, so a crafted `time` can't produce a NaN start or
  // pollute the agenda with an off-grid appointment.
  if (!baseSlots(data.dateISO).includes(data.time)) {
    return NextResponse.json({ error: 'invalid_time' }, { status: 400 });
  }
  const payUrl = process.env.MERKTOP_RESERVATION_PAY_URL;
  if (!payUrl) {
    return NextResponse.json(
      { error: locale === 'en' ? 'Reservations are not available right now.' : 'Las reservas no estan disponibles en este momento.' },
      { status: 503 },
    );
  }

  const durMin = durationMinutes(service.duration);
  let startsAt: Date;
  let ref: string;
  try {
    // Anti double-booking: the chosen slot must still be free among paid bookings.
    // paidBookingsForDate already returns startMin in Miami local minutes.
    const paid = await paidBookingsForDate(data.dateISO);
    const free = computeAvailableSlots([data.time], durMin, paid);
    if (free.length === 0) {
      return NextResponse.json(
        { error: locale === 'en' ? 'That time is no longer available.' : 'Ese horario ya no esta disponible.' },
        { status: 409 },
      );
    }

    startsAt = slotToStartsAt(data.dateISO, data.time);
    ref = generateBookingRef(new Date(`${data.dateISO}T12:00:00Z`));

    const MAX_REF_ATTEMPTS = 3;
    for (let attempt = 1; attempt <= MAX_REF_ATTEMPTS; attempt++) {
      try {
        await createBooking({
          ref, serviceId: service.id, serviceName: service.name, durationMin: durMin,
          startsAt, name: data.name, email: data.email, phone: data.phone, notes: data.notes ?? null,
        });
        break;
      } catch (err) {
        const isRefCollision = (err as { code?: string } | null)?.code === '23505';
        if (isRefCollision && attempt < MAX_REF_ATTEMPTS) {
          ref = generateBookingRef(new Date(`${data.dateISO}T12:00:00Z`));
          continue;
        }
        throw err;
      }
    }
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }

  const url = `${payUrl}?ref=${encodeURIComponent(ref)}&for=${encodeURIComponent(startsAt.toISOString())}`;
  return NextResponse.json({ url });
}
