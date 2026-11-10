import { parseTime, MINUTES_PER_DAY } from '@/lib/availability';

/** Convert integer minutes after midnight into a readable 12-hour clock string. */
export function formatClock(minutes: number): string {
  const m = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h24 = Math.floor(m / 60);
  const min = m % 60;
  const period = h24 < 12 ? 'AM' : 'PM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const mm = min.toString().padStart(2, '0');
  return `${h12}:${mm} ${period}`;
}

/** Convert integer minutes after midnight into a 24-hour HH:MM string. */
export function format24h(minutes: number): string {
  const m = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h24 = Math.floor(m / 60);
  const min = m % 60;
  return `${h24.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

/** Format a [start, end] booking interval for display. */
export function formatInterval(start: number, end: number): string {
  return `${formatClock(start)} – ${formatClock(end)}`;
}

/**
 * Returns the HH:MM equivalent for a valid integer minute value in 0–1440,
 * or null for empty, non-integer, out-of-range, or non-numeric input.
 */
export function readableTime(input: string): string | null {
  const trimmed = input.trim();
  if (trimmed === '') return null;
  const minutes = parseTime(trimmed);
  if (minutes === null) return null;
  if (minutes < 0 || minutes > MINUTES_PER_DAY) return null;
  return format24h(minutes);
}
