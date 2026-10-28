import { parseDateString, todayString } from './dateUtils';

export const MIN_GUESTS = 1;
export const MAX_GUESTS = 10;
export const OCCASIONS = ['Birthday', 'Anniversary', 'Engagement', 'Other'];

/**
 * Validates the booking form values.
 *
 * @param {{date: string, time: string, guests: string|number, occasion: string}} values
 * @param {string[]} availableTimes - Slots currently offered for the chosen date.
 * @returns {Object<string,string>} Map of field name -> error message.
 *          An empty object means the values are valid.
 */
export function validateBooking(values, availableTimes = []) {
  const errors = {};

  // Date: required, real, and not in the past.
  if (!values.date) {
    errors.date = 'Please choose a date for your reservation.';
  } else if (!parseDateString(values.date)) {
    errors.date = 'Please enter a valid date.';
  } else if (values.date < todayString()) {
    errors.date = 'The date cannot be in the past.';
  }

  // Time: required and must be one of the slots offered for that date.
  if (!values.time) {
    errors.time = 'Please select a time.';
  } else if (!availableTimes.includes(values.time)) {
    errors.time = 'That time is not available. Please pick another.';
  }

  // Guests: whole number within the restaurant's limits.
  const guests = Number(values.guests);
  if (values.guests === '' || values.guests === null || values.guests === undefined) {
    errors.guests = 'Please enter the number of guests.';
  } else if (!Number.isInteger(guests)) {
    errors.guests = 'The number of guests must be a whole number.';
  } else if (guests < MIN_GUESTS || guests > MAX_GUESTS) {
    errors.guests = `We can seat between ${MIN_GUESTS} and ${MAX_GUESTS} guests online. For larger groups please call us.`;
  }

  // Occasion: required and must be a known option.
  if (!values.occasion) {
    errors.occasion = 'Please select an occasion.';
  } else if (!OCCASIONS.includes(values.occasion)) {
    errors.occasion = 'Please choose one of the listed occasions.';
  }

  return errors;
}
