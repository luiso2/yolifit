import { NextResponse } from 'next/server';
import { getSpaServices } from '@/lib/services';
import { durationMinutes } from '@/lib/duration';
import { computeAvailableSlots } from '@/lib/availability';
import { paidBookingsForDate } from '@/lib/db';

// The static weekly schedule (mirror of Reservas.tsx getTimeSlots). Kept here so
// the server is the source of truth for which slots are offered.
function baseSlots(dateISO: string): string[] {
  const dow = new Date(`${dateISO}T12:00:00Z`).getUTCDay();
  if (dow === 0) return [];
  if (dow === 6) return ['09:00 AM', '10:15 AM', '11:30 AM', '12:45 PM', '02:00 PM'];
  return ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'];
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date') ?? '';
  const serviceId = url.searchParams.get('serviceId') ?? '';
  const locale = url.searchParams.get('locale') === 'en' ? 'en' : 'es';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ slots: [] });
  }
  const service = getSpaServices(locale).find((s) => s.id === serviceId);
  const durMin = service ? durationMinutes(service.duration) : 60;
  const paid = await paidBookingsForDate(date);
  return NextResponse.json({ slots: computeAvailableSlots(baseSlots(date), durMin, paid) });
}
