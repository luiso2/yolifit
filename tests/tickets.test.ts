import { generateTicketCode, ticketFromSessionId } from '../lib/tickets';

describe('generateTicketCode', () => {
  it('genera código YS-YYYYMMDD-NNNN determinista con random inyectado', () => {
    const date = new Date('2026-07-15T12:00:00Z');
    expect(generateTicketCode(date, () => 0)).toBe('YS-20260715-1000');
    expect(generateTicketCode(date, () => 0.9999)).toBe('YS-20260715-9999');
  });
});

describe('ticketFromSessionId', () => {
  it('deriva sufijo estable de 6 chars del session id', () => {
    expect(ticketFromSessionId('cs_test_a1B2c3D4e5F6xyz789', '2026-07-15')).toBe('YS-20260715-XYZ789');
  });
});
