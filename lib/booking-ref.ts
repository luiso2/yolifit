// Correlation id shared with Merktop via ?ref=... on the pay URL; it comes back
// on every webhook as data.ref so we can tie the deposit to this booking.
export function generateBookingRef(date: Date, random: () => number = Math.random): string {
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const num = Math.floor(1000 + random() * 9000);
  return `YS-${dateStr}-${num}`;
}
