import { createHmac } from 'node:crypto';
import { verifyMerktopSignature } from '../lib/merktop-webhook';

const SECRET = 'whsec_merktop_testsecret';
function signHeader(body: string, t: number): string {
  const sig = createHmac('sha256', SECRET).update(`${t}.${body}`).digest('hex');
  return `t=${t},v1=${sig}`;
}

describe('verifyMerktopSignature', () => {
  const body = JSON.stringify({ id: 'evt_1', type: 'deposit.paid', data: { ref: 'YS-20260715-1000' } });
  const now = 1_800_000_000;

  it('accepts a valid, fresh signature', () => {
    const header = signHeader(body, now);
    expect(verifyMerktopSignature({ secret: SECRET, rawBody: body, signatureHeader: header, nowSec: now })).toBe(true);
  });
  it('rejects a tampered body', () => {
    const header = signHeader(body, now);
    expect(verifyMerktopSignature({ secret: SECRET, rawBody: body + 'x', signatureHeader: header, nowSec: now })).toBe(false);
  });
  it('rejects a stale timestamp (older than 5 min)', () => {
    const header = signHeader(body, now - 301);
    expect(verifyMerktopSignature({ secret: SECRET, rawBody: body, signatureHeader: header, nowSec: now })).toBe(false);
  });
  it('rejects a missing or malformed header', () => {
    expect(verifyMerktopSignature({ secret: SECRET, rawBody: body, signatureHeader: null, nowSec: now })).toBe(false);
    expect(verifyMerktopSignature({ secret: SECRET, rawBody: body, signatureHeader: 'garbage', nowSec: now })).toBe(false);
  });
});
