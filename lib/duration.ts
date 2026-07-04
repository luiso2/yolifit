// Service durations in the catalog are free text ("90 minutos", "60 minutes").
// Reservations need the numeric minutes to block the right calendar slots.
export function durationMinutes(durationText: string): number {
  const match = durationText.match(/\d+/);
  return match ? parseInt(match[0], 10) : 60;
}
