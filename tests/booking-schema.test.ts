import { bookingSchema } from '../lib/booking-schema';

const valid = {
  serviceId: '1',
  dateISO: '2026-07-15',
  time: '10:30 AM',
  name: 'Maria Perez',
  email: 'maria@example.com',
  phone: '+1 305 555 0100',
  notes: 'Piel sensible',
};

describe('bookingSchema', () => {
  it('acepta una reserva válida (notes opcional)', () => {
    expect(bookingSchema.parse(valid)).toMatchObject({ serviceId: '1' });
    const { notes, ...noNotes } = valid;
    expect(bookingSchema.parse(noNotes).notes).toBeUndefined();
  });

  it('rechaza email inválido, fecha mal formada y nombre corto', () => {
    expect(bookingSchema.safeParse({ ...valid, email: 'no-email' }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...valid, dateISO: '15/07/2026' }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...valid, name: 'A' }).success).toBe(false);
  });
});
