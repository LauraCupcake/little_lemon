/**
 * Mock booking API.
 *
 * The real Little Lemon back end does not exist yet, so this module simulates
 * it with the same shape the Meta capstone API uses:
 *   - fetchAPI(date)      -> array of available time slots for that date
 *   - submitAPI(formData) -> true when the booking is accepted
 *
 * Swapping this for real HTTP calls later only requires changing this file.
 */

/** Deterministic pseudo-random generator so a given day always has the same slots. */
function seededRandom(seed) {
  const m = 2 ** 35 - 31;
  const a = 185852;
  let s = seed % m;
  return () => {
    s = (s * a) % m;
    return s / m;
  };
}

/**
 * Returns the available booking times (e.g. ["17:00", "18:30"]) for a date.
 * @param {Date} date - A valid Date object.
 * @returns {string[]} Sorted list of "HH:MM" slots (may be empty).
 * @throws {TypeError} If `date` is not a valid Date.
 */
export function fetchAPI(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError('fetchAPI expects a valid Date object.');
  }

  const random = seededRandom(date.getDate() + date.getMonth() * 31);
  const slots = [];
  for (let hour = 17; hour <= 23; hour += 1) {
    if (random() < 0.5) slots.push(`${hour}:00`);
    if (random() < 0.5) slots.push(`${hour}:30`);
  }
  return slots;
}

/**
 * Submits a booking. The mock accepts every well-formed booking.
 * @param {{date: string, time: string, guests: number|string, occasion: string}} formData
 * @returns {boolean} true when accepted, false when rejected.
 */
export function submitAPI(formData) {
  return Boolean(formData && formData.date && formData.time);
}
