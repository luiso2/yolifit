import { NextResponse } from 'next/server';
import { bookingSchema } from '@/lib/booking-schema';
import { getSpaServices } from '@/lib/services';
import { durationMinutes } from '@/lib/duration';
import { generateBookingRef } from '@/lib/booking-ref';
import { computeAvailableSlots } from '@/lib/availability';
import { createBooking, paidBookingsForDate } from '@/lib/db';

// Combine a YYYY-MM-DD date and a "10:30 AM" slot into an absolute instant,
// interpreting the wall-clock time as America/New_York (Miami).
function slotToStartsAt(dateISO: string, time: string): Date {
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return new Date(`${dateISO}T12:00:00-04:00`);
  let hour = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === 'PM') hour += 12;
  const hh = String(hour).padStart(2, '0');
  // Miami is UTC-4 (EDT) in summer; the reservation window is same-day so a fixed
  // -04:00 offset is acceptable for the MVP (documented tradeoff).
  return new Date(`${dateISO}T${hh}:${m[2]}:00-04:00`);
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
  const payUrl = process.env.MERKTOP_RESERVATION_PAY_URL;
  if (!payUrl) {
    return NextResponse.json(
      { error: locale === 'en' ? 'Reservations are not available right now.' : 'Las reservas no estan disponibles en este momento.' },
      { status: 503 },
    );
  }

  const durMin = durationMinutes(service.duration);
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

  const startsAt = slotToStartsAt(data.dateISO, data.time);
  const ref = generateBookingRef(new Date(`${data.dateISO}T12:00:00Z`));
  await createBooking({
    ref, serviceId: service.id, serviceName: service.name, durationMin: durMin,
    startsAt, name: data.name, email: data.email, phone: data.phone, notes: data.notes ?? null,
  });

  const url = `${payUrl}?ref=${encodeURIComponent(ref)}&for=${encodeURIComponent(startsAt.toISOString())}`;
  return NextResponse.json({ url });
}
