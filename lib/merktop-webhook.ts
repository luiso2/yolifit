import { createHmac, timingSafeEqual } from 'node:crypto';

const MAX_SKEW_SEC = 300;

// Verifies Merktop's outbound webhook signature. Header format:
// `merktop-signature: t=<unixSec>,v1=<hexHmac>` where the HMAC is over
// `${t}.${rawBody}` with the per-business webhook secret. Rejects replays
// (timestamp older than 5 minutes) and any signature mismatch.
export function verifyMerktopSignature(args: {
  secret: string;
  rawBody: string;
  signatureHeader: string | null;
  nowSec: number;
}): boolean {
  if (!args.signatureHeader) return false;
  const parts = Object.fromEntries(
    args.signatureHeader.split(',').map((kv) => {
      const i = kv.indexOf('=');
      return [kv.slice(0, i).trim(), kv.slice(i + 1).trim()];
    }),
  );
  const t = Number(parts.t);
  const v1 = parts.v1;
  if (!Number.isFinite(t) || !v1) return false;
  if (Math.abs(args.nowSec - t) > MAX_SKEW_SEC) return false;
  const expected = createHmac('sha256', args.secret).update(`${t}.${args.rawBody}`).digest('hex');
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(v1, 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
