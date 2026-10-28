import { initializeTimes, updateTimes, UPDATE_TIMES } from './availableTimes';
import * as api from '../api/bookingApi';

describe('initializeTimes', () => {
  test('returns the times for today with no error', () => {
    const state = initializeTimes();
    expect(state.error).toBeNull();
    expect(Array.isArray(state.times)).toBe(true);
  });
});

describe('updateTimes', () => {
  const state = { times: ['17:00'], error: null };

  test('returns the slots for the date in the action', () => {
    const next = updateTimes(state, { type: UPDATE_TIMES, date: '2030-06-15' });
    expect(next.times).toEqual(api.fetchAPI(new Date(2030, 5, 15)));
    expect(next.error).toBeNull();
  });

  test('returns an empty list (not an error) for an empty or invalid date', () => {
    expect(updateTimes(state, { type: UPDATE_TIMES, date: '' })).toEqual({ times: [], error: null });
    expect(updateTimes(state, { type: UPDATE_TIMES, date: '2030-02-31' })).toEqual({ times: [], error: null });
  });

  test('returns the same state for unknown actions', () => {
    expect(updateTimes(state, { type: 'SOMETHING_ELSE' })).toBe(state);
  });

  test('returns a friendly error when the API fails', () => {
    const spy = jest.spyOn(api, 'fetchAPI').mockImplementation(() => {
      throw new Error('network down');
    });
    const next = updateTimes(state, { type: UPDATE_TIMES, date: '2030-06-15' });
    expect(next.times).toEqual([]);
    expect(next.error).toMatch(/could not load the available times/i);
    spy.mockRestore();
  });
});
