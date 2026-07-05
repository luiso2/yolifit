import { z } from 'zod';

// Body accepted by POST /api/gift-cards/buy. Mirrors Merktop's public buy
// contract EXCEPT business_id, which the API route injects server-side. Amount
// is already in cents (the client converts via parseAmountToCents).
export const giftCardBuySchema = z.object({
  amount: z.number().int().min(500).max(10_000_000),
  buyer_name: z.string().trim().min(1).max(120),
  buyer_email: z.string().email(),
  recipient_name: z.string().trim().max(120).optional().nullable(),
  recipient_email: z.string().email().optional().nullable(),
  message: z.string().max(500).optional().nullable(),
});

export type GiftCardBuyInput = z.infer<typeof giftCardBuySchema>;
