// Converts a user-entered USD string ("50", "50.00", "50.5") into integer
// cents. Returns 0 for empty, non-numeric, zero, or negative input so callers
// can reject it against the $5.00 minimum in one check.
export function parseAmountToCents(usd: string): number {
  const n = parseFloat(usd);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100);
}
