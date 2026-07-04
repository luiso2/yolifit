// Two half-open ranges [aStart, aEnd) and [bStart, bEnd) overlap iff
// aStart < bEnd && bStart < aEnd. Edge-touching (one ends where the other
// starts) does NOT overlap, so back-to-back appointments are allowed.
export function parseSlotToMinutes(slot: string): number {
  const m = slot.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return NaN;
  let hour = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === 'PM') hour += 12;
  return hour * 60 + parseInt(m[2], 10);
}

export function computeAvailableSlots(
  baseSlots: string[],
  candidateDurationMin: number,
  paidBookings: Array<{ startMin: number; durationMin: number }>,
): string[] {
  return baseSlots.filter((slot) => {
    const start = parseSlotToMinutes(slot);
    const end = start + candidateDurationMin;
    return !paidBookings.some((b) => start < b.startMin + b.durationMin && b.startMin < end);
  });
}
