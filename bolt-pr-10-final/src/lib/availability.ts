export type Booking = [number, number];

export type AvailabilityResult = {
  available: boolean;
  reason?: string;
};

export const MAX_DURATION_MINUTES = 120;
export const MINUTES_PER_DAY = 1440;

/**
 * Parse a raw input value into an integer minute count.
 * Rejects missing, empty, non-finite, non-integer, and Boolean values.
 * Returns null when the value is not a valid integer minute.
 */
export function parseTime(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  // Booleans must be rejected explicitly: typeof true === 'boolean'.
  if (typeof value === 'boolean') {
    return null;
  }
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) {
    return null;
  }
  if (!Number.isInteger(num)) {
    return null;
  }
  return num;
}

/**
 * Check whether a requested [start, end) interval is available for a room.
 *
 * Acceptance criteria:
 *  AC1 - 0 <= start < end <= 1440, start > now, reject invalid/missing/
 *        non-integer/Boolean values.
 *  AC2 - duration (end - start) <= 120 minutes.
 *  AC3 - a blocked room is always Unavailable.
 *  AC4 - reject overlap using start < existingEnd && end > existingStart;
 *        touching endpoints are allowed.
 *  AC5 - this function never creates, modifies, or deletes bookings.
 */
export function checkAvailability(
  startInput: unknown,
  endInput: unknown,
  now: number,
  blocked: boolean,
  existing: Booking[]
): AvailabilityResult {
  const start = parseTime(startInput);
  const end = parseTime(endInput);

  // AC1 - reject invalid, missing, non-integer, and Boolean time values.
  if (start === null) {
    return { available: false, reason: 'Start time is missing or not a valid integer.' };
  }
  if (end === null) {
    return { available: false, reason: 'End time is missing or not a valid integer.' };
  }

  // AC1 - bounds: 0 <= start < end <= 1440.
  if (start < 0 || start > MINUTES_PER_DAY) {
    return { available: false, reason: 'Start time must be between 0 and 1440 minutes.' };
  }
  if (end < 0 || end > MINUTES_PER_DAY) {
    return { available: false, reason: 'End time must be between 0 and 1440 minutes.' };
  }
  if (start >= end) {
    return { available: false, reason: 'Start time must be strictly less than end time.' };
  }

  // AC1 - requested start must be strictly greater than the current time.
  if (start <= now) {
    return {
      available: false,
      reason: `Start time must be later than the current time (${now} minutes).`,
    };
  }

  // AC2 - maximum booking duration is 120 minutes (exactly 120 is allowed).
  const duration = end - start;
  if (duration > MAX_DURATION_MINUTES) {
    return {
      available: false,
      reason: `Booking duration is ${duration} minutes. The maximum allowed is ${MAX_DURATION_MINUTES} minutes.`,
    };
  }

  // AC3 - a blocked room is always unavailable.
  if (blocked) {
    return { available: false, reason: 'This room is currently blocked and cannot be booked.' };
  }

  // AC4 - reject overlapping bookings. Touching endpoints are allowed.
  for (const [existingStart, existingEnd] of existing) {
    if (start < existingEnd && end > existingStart) {
      return {
        available: false,
        reason: `The requested time overlaps an existing booking (${existingStart}–${existingEnd} minutes).`,
      };
    }
  }

  // AC5 - availability only; no booking is created.
  return { available: true };
}
