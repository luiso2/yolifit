import { durationMinutes } from '../lib/duration';

describe('durationMinutes', () => {
  it('parses the leading integer from Spanish and English duration text', () => {
    expect(durationMinutes('90 minutos')).toBe(90);
    expect(durationMinutes('60 minutes')).toBe(60);
    expect(durationMinutes('45 minutos')).toBe(45);
  });
  it('falls back to 60 when there is no number', () => {
    expect(durationMinutes('Consultar')).toBe(60);
    expect(durationMinutes('')).toBe(60);
  });
});
