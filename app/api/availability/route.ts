import { NextResponse } from 'next/server';
import { getSpaServices } from '@/lib/services';
import { durationMinutes } from '@/lib/duration';
import { computeAvailableSlots } from '@/lib/availability';
import { paidBookingsForDate } from '@/lib/db';
import { baseSlots } from '@/lib/slots';

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
