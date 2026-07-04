import { parseAmountToCents } from '../lib/gift-amount';

describe('parseAmountToCents', () => {
  it('converts whole and decimal dollars to cents', () => {
    expect(parseAmountToCents('50')).toBe(5000);
    expect(parseAmountToCents('50.00')).toBe(5000);
    expect(parseAmountToCents('50.5')).toBe(5050);
    expect(parseAmountToCents('5')).toBe(500);
  });

  it('returns 0 for empty, non-numeric, zero, or negative input', () => {
    expect(parseAmountToCents('')).toBe(0);
    expect(parseAmountToCents('abc')).toBe(0);
    expect(parseAmountToCents('0')).toBe(0);
    expect(parseAmountToCents('-5')).toBe(0);
  });

  it('rounds to the nearest cent', () => {
    expect(parseAmountToCents('50.999')).toBe(5100);
    expect(parseAmountToCents('50.001')).toBe(5000);
  });
});
