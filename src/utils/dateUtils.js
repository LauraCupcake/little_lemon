/**
 * Date helpers. Booking dates are handled as "YYYY-MM-DD" strings (the value
 * format of <input type="date">) and parsed in LOCAL time, because
 * `new Date("2026-10-28")` is parsed as UTC and can land on the wrong day.
 */

const pad = (n) => String(n).padStart(2, '0');

/** Formats a Date as "YYYY-MM-DD" in local time. */
export function toDateString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Today's date as "YYYY-MM-DD". */
export function todayString() {
  return toDateString(new Date());
}

/**
 * Parses "YYYY-MM-DD" into a local Date. Returns null for malformed or
 * impossible dates (e.g. "2026-02-31").
 */
export function parseDateString(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const date = new Date(y, m - 1, d);
  const isReal =
    date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  return isReal ? date : null;
}

/** Human friendly date, e.g. "Wednesday, 28 October 2026". */
export function formatLongDate(value) {
  const date = parseDateString(value);
  return date
    ? date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : value;
}
