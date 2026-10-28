import { fetchAPI } from '../api/bookingApi';
import { parseDateString } from '../utils/dateUtils';

export const UPDATE_TIMES = 'UPDATE_TIMES';

const LOAD_ERROR =
  'Sorry, we could not load the available times. Please try again later.';

/** Looks up the times for a date and wraps failures in an error message. */
function loadTimes(date) {
  try {
    return { times: fetchAPI(date), error: null };
  } catch (err) {
    return { times: [], error: LOAD_ERROR };
  }
}

/** Initial reducer state: the times available today. */
export function initializeTimes() {
  return loadTimes(new Date());
}

/**
 * Reducer for the available booking times.
 * State shape: { times: string[], error: string | null }
 * Action: { type: 'UPDATE_TIMES', date: 'YYYY-MM-DD' }
 */
export function updateTimes(state, action) {
  switch (action.type) {
    case UPDATE_TIMES: {
      const date = parseDateString(action.date);
      // An empty/invalid date has no slots, but it is not a server error.
      return date ? loadTimes(date) : { times: [], error: null };
    }
    default:
      return state;
  }
}
