// The static weekly schedule (mirror of Reservas.tsx getTimeSlots). Kept here so
// both the availability route and the reservas route share a single source of
// truth for which slots are offered, instead of duplicating (and drifting).
export function baseSlots(dateISO: string): string[] {
  const dow = new Date(`${dateISO}T12:00:00Z`).getUTCDay();
  if (dow === 0) return [];
  if (dow === 6) return ['09:00 AM', '10:15 AM', '11:30 AM', '12:45 PM', '02:00 PM'];
  return ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'];
}
