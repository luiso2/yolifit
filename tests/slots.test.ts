import { baseSlots } from '../lib/slots';

describe('baseSlots', () => {
  it('returns no slots on Sunday', () => {
    // 2026-07-05 is a Sunday.
    expect(baseSlots('2026-07-05')).toEqual([]);
  });
  it('returns the Saturday schedule', () => {
    // 2026-07-04 is a Saturday.
    expect(baseSlots('2026-07-04')).toEqual(['09:00 AM', '10:15 AM', '11:30 AM', '12:45 PM', '02:00 PM']);
  });
  it('returns the weekday schedule', () => {
    // 2026-07-06 is a Monday.
    expect(baseSlots('2026-07-06')).toEqual([
      '09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM',
    ]);
  });
});
