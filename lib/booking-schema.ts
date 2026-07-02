import { z } from 'zod';

export const bookingSchema = z.object({
  serviceId: z.string().min(1),
  dateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().min(1),
  name: z.string().trim().min(2),
  email: z.string().email(),
  phone: z.string().trim().min(7),
  notes: z.string().max(500).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
