import { generateBookingRef } from '../lib/booking-ref';

describe('generateBookingRef', () => {
  it('produces YS-YYYYMMDD-NNNN, deterministic with injected random', () => {
    const date = new Date('2026-07-15T12:00:00Z');
    expect(generateBookingRef(date, () => 0)).toBe('YS-20260715-1000');
    expect(generateBookingRef(date, () => 0.9999)).toBe('YS-20260715-9999');
  });
});
