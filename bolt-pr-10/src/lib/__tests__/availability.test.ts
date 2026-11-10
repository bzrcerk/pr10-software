import { describe, it, expect } from 'vitest';
import {
  checkAvailability,
  parseTime,
  type Booking,
} from '@/lib/availability';
import { formatClock, format24h, formatInterval, readableTime } from '@/lib/format';

// Shared fixture data per the assignment.
const NOW = 540;
const BLOCKED = false;
const EXISTING: Booking[] = [[600, 660]];

describe('AC1 - Time validation', () => {
  it('T5: rejects start not strictly greater than now (540-570)', () => {
    const r = checkAvailability(540, 570, NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(false);
  });

  it('T6: rejects start >= end (720-660)', () => {
    const r = checkAvailability(720, 660, NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(false);
  });

  it('T7: rejects end out of bounds (1400-1441)', () => {
    const r = checkAvailability(1400, 1441, NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(false);
  });

  it('T8: rejects empty inputs', () => {
    const r = checkAvailability('', '', NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(false);
  });

  it('rejects missing (undefined) inputs', () => {
    const r = checkAvailability(undefined, undefined, NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(false);
  });

  it('rejects null inputs', () => {
    const r = checkAvailability(null, null, NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(false);
  });

  it('rejects Boolean inputs', () => {
    expect(checkAvailability(true, 600, NOW, BLOCKED, EXISTING).available).toBe(false);
    expect(checkAvailability(600, false, NOW, BLOCKED, EXISTING).available).toBe(false);
    expect(checkAvailability(true, false, NOW, BLOCKED, EXISTING).available).toBe(false);
  });

  it('rejects non-integer numeric inputs', () => {
    expect(checkAvailability(540.5, 600, NOW, BLOCKED, EXISTING).available).toBe(false);
    expect(checkAvailability(600, 660.5, NOW, BLOCKED, EXISTING).available).toBe(false);
  });

  it('rejects NaN inputs', () => {
    expect(checkAvailability(NaN, 600, NOW, BLOCKED, EXISTING).available).toBe(false);
    expect(checkAvailability(600, NaN, NOW, BLOCKED, EXISTING).available).toBe(false);
  });

  it('rejects non-numeric string inputs', () => {
    expect(checkAvailability('abc', 600, NOW, BLOCKED, EXISTING).available).toBe(false);
    expect(checkAvailability(600, 'xyz', NOW, BLOCKED, EXISTING).available).toBe(false);
  });

  it('allows start equal to 0 boundary is rejected because start must be > now', () => {
    const r = checkAvailability(0, 60, NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(false);
  });

  it('parseTime rejects Boolean true and false', () => {
    expect(parseTime(true)).toBeNull();
    expect(parseTime(false)).toBeNull();
  });

  it('parseTime accepts valid integer strings and numbers', () => {
    expect(parseTime(540)).toBe(540);
    expect(parseTime('540')).toBe(540);
  });
});

describe('AC2 - Duration limit', () => {
  it('T4: rejects duration > 120 (720-841)', () => {
    const r = checkAvailability(720, 841, NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(false);
  });

  it('allows exactly 120 minutes', () => {
    const r = checkAvailability(660, 780, NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(true);
  });

  it('T3: allows 720-840 (exactly 120 minutes, non-overlapping)', () => {
    const r = checkAvailability(720, 840, NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(true);
  });

  it('rejects 121 minutes', () => {
    const r = checkAvailability(660, 781, NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(false);
  });
});

describe('AC3 - Blocked room', () => {
  it('returns Unavailable for a blocked room even with otherwise valid input', () => {
    const r = checkAvailability(660, 720, NOW, true, EXISTING);
    expect(r.available).toBe(false);
  });

  it('returns Unavailable for a blocked room on a free interval', () => {
    const r = checkAvailability(720, 840, NOW, true, EXISTING);
    expect(r.available).toBe(false);
  });
});

describe('AC4 - Booking overlap', () => {
  it('T1: 660-720 is Available (touches existing at endpoint)', () => {
    const r = checkAvailability(660, 720, NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(true);
  });

  it('T2: 630-690 is Unavailable (overlaps existing 600-660)', () => {
    const r = checkAvailability(630, 690, NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(false);
  });

  it('allows touching at the start endpoint (540..600 vs 600..660 is not tested for now>540)', () => {
    // Use now=540 and start=560 end=600 => touches existing start, allowed.
    const r = checkAvailability(560, 600, NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(true);
  });

  it('rejects a fully-contained overlap', () => {
    const r = checkAvailability(610, 650, NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(false);
  });

  it('rejects a partial overlap at the end of existing', () => {
    const r = checkAvailability(650, 700, NOW, BLOCKED, EXISTING);
    expect(r.available).toBe(false);
  });
});

describe('AC5 - No mutation of existing bookings', () => {
  it('does not create, modify, or delete existing bookings', () => {
    const snapshot: Booking[] = [[600, 660]];
    const original = JSON.parse(JSON.stringify(snapshot));
    const r = checkAvailability(660, 720, NOW, BLOCKED, snapshot);
    expect(r.available).toBe(true);
    expect(snapshot).toEqual(original);
    expect(snapshot.length).toBe(1);
    expect(snapshot[0]).toEqual([600, 660]);
  });

  it('leaves bookings unchanged even on rejected (overlap) requests', () => {
    const snapshot: Booking[] = [[600, 660]];
    const original = JSON.parse(JSON.stringify(snapshot));
    checkAvailability(630, 690, NOW, BLOCKED, snapshot);
    expect(snapshot).toEqual(original);
  });
});

describe('Time formatting - format24h (HH:MM)', () => {
  it('540 converts to 09:00', () => {
    expect(format24h(540)).toBe('09:00');
  });

  it('660 converts to 11:00', () => {
    expect(format24h(660)).toBe('11:00');
  });

  it('720 converts to 12:00', () => {
    expect(format24h(720)).toBe('12:00');
  });

  it('840 converts to 14:00', () => {
    expect(format24h(840)).toBe('14:00');
  });

  it('0 converts to 00:00', () => {
    expect(format24h(0)).toBe('00:00');
  });

  it('1440 wraps to 00:00', () => {
    expect(format24h(1440)).toBe('00:00');
  });

  it('pads single-digit hours and minutes', () => {
    expect(format24h(61)).toBe('01:01');
  });
});

describe('Time formatting - formatClock (12-hour)', () => {
  it('540 -> 9:00 AM', () => {
    expect(formatClock(540)).toBe('9:00 AM');
  });

  it('660 -> 11:00 AM', () => {
    expect(formatClock(660)).toBe('11:00 AM');
  });

  it('720 -> 12:00 PM', () => {
    expect(formatClock(720)).toBe('12:00 PM');
  });

  it('840 -> 2:00 PM', () => {
    expect(formatClock(840)).toBe('2:00 PM');
  });

  it('formatInterval joins start and end', () => {
    expect(formatInterval(600, 660)).toBe('10:00 AM – 11:00 AM');
  });
});

describe('readableTime preview helper', () => {
  it('returns HH:MM for valid integers in range', () => {
    expect(readableTime('540')).toBe('09:00');
    expect(readableTime('660')).toBe('11:00');
    expect(readableTime('720')).toBe('12:00');
    expect(readableTime('840')).toBe('14:00');
  });

  it('returns null for empty input', () => {
    expect(readableTime('')).toBeNull();
    expect(readableTime('   ')).toBeNull();
  });

  it('returns null for non-integer input', () => {
    expect(readableTime('540.5')).toBeNull();
  });

  it('returns null for out-of-range values', () => {
    expect(readableTime('-1')).toBeNull();
    expect(readableTime('1441')).toBeNull();
  });

  it('returns null for non-numeric input', () => {
    expect(readableTime('abc')).toBeNull();
  });
});

describe('Required availability tests T1-T8', () => {
  const cases: Array<[string, number, number, boolean]> = [
    ['T1: 660-720 -> Available', 660, 720, true],
    ['T2: 630-690 -> Unavailable', 630, 690, false],
    ['T3: 720-840 -> Available', 720, 840, true],
    ['T4: 720-841 -> Unavailable', 720, 841, false],
    ['T5: 540-570 -> Unavailable', 540, 570, false],
    ['T6: 720-660 -> Unavailable', 720, 660, false],
    ['T7: 1400-1441 -> Unavailable', 1400, 1441, false],
  ];
  for (const [name, start, end, expected] of cases) {
    it(name, () => {
      expect(checkAvailability(start, end, NOW, BLOCKED, EXISTING).available).toBe(expected);
    });
  }
  it('T8: Empty inputs -> Unavailable', () => {
    expect(checkAvailability('', '', NOW, BLOCKED, EXISTING).available).toBe(false);
  });
});
