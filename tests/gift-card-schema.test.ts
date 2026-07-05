import { giftCardBuySchema } from '../lib/gift-card-schema';

const valid = {
  amount: 5000,
  buyer_name: 'Ana Perez',
  buyer_email: 'ana@example.com',
  recipient_name: null,
  recipient_email: null,
  message: null,
};

describe('giftCardBuySchema', () => {
  it('accepts a valid buy request (recipient fields nullable)', () => {
    expect(giftCardBuySchema.parse(valid)).toMatchObject({ amount: 5000 });
    expect(giftCardBuySchema.safeParse({ ...valid, recipient_name: 'Sofia', recipient_email: 'sofia@example.com', message: 'Feliz cumple' }).success).toBe(true);
  });

  it('rejects amount below the $5 minimum and above the max', () => {
    expect(giftCardBuySchema.safeParse({ ...valid, amount: 499 }).success).toBe(false);
    expect(giftCardBuySchema.safeParse({ ...valid, amount: 10_000_001 }).success).toBe(false);
    expect(giftCardBuySchema.safeParse({ ...valid, amount: 50.5 }).success).toBe(false);
  });

  it('rejects a missing buyer name and an invalid buyer email', () => {
    expect(giftCardBuySchema.safeParse({ ...valid, buyer_name: '' }).success).toBe(false);
    expect(giftCardBuySchema.safeParse({ ...valid, buyer_email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects an invalid recipient email when provided', () => {
    expect(giftCardBuySchema.safeParse({ ...valid, recipient_email: 'nope' }).success).toBe(false);
  });
});
