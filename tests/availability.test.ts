import { parseSlotToMinutes, computeAvailableSlots } from '../lib/availability';

describe('parseSlotToMinutes', () => {
  it('parses 12h AM/PM to minutes since midnight', () => {
    expect(parseSlotToMinutes('10:30 AM')).toBe(630);
    expect(parseSlotToMinutes('02:00 PM')).toBe(840);
    expect(parseSlotToMinutes('12:00 PM')).toBe(720);
    expect(parseSlotToMinutes('12:00 AM')).toBe(0);
  });
});

describe('computeAvailableSlots', () => {
  const base = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM'];
  it('removes slots that overlap a paid booking (by duration)', () => {
    // A 90-min booking at 10:30 (630..720) blocks 10:30 and 12:00 (720) is edge-open.
    const paid = [{ startMin: 630, durationMin: 90 }];
    // candidate services are 60 min: 09:00 (540..600) free, 10:30 (630..690) overlaps,
    // 12:00 (720..780) free (booking ends at 720), 01:30 (810..870) free.
    expect(computeAvailableSlots(base, 60, paid)).toEqual(['09:00 AM', '12:00 PM', '01:30 PM']);
  });
  it('keeps all slots when there are no paid bookings', () => {
    expect(computeAvailableSlots(base, 60, [])).toEqual(base);
  });
  it('blocks a slot whose candidate range reaches into a later booking', () => {
    // Booking at 12:00 PM, 60 min: blocks 720..780.
    // 90-min candidate at 09:00 (540..630): free.
    // 90-min candidate at 10:30 (630..720): ends exactly at 720, edge-touching -> free.
    // 90-min candidate at 12:00 (720..810): starts at 720, inside booking -> blocked.
    // 90-min candidate at 01:30 (810..900): starts after booking ends (780) -> free.
    const paid = [{ startMin: 720, durationMin: 60 }];
    expect(computeAvailableSlots(base, 90, paid)).toEqual(['09:00 AM', '10:30 AM', '01:30 PM']);
  });
});
