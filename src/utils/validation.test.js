import { validateBooking, MAX_GUESTS } from './validation';
import { dateFromToday } from '../test-utils';

const times = ['17:00', '18:30'];
const valid = { date: dateFromToday(3), time: '17:00', guests: '4', occasion: 'Birthday' };

describe('validateBooking', () => {
  test('accepts valid values', () => {
    expect(validateBooking(valid, times)).toEqual({});
  });

  test('requires every field', () => {
    const errors = validateBooking({ date: '', time: '', guests: '', occasion: '' }, times);
    expect(Object.keys(errors).sort()).toEqual(['date', 'guests', 'occasion', 'time']);
  });

  test('rejects dates in the past', () => {
    expect(validateBooking({ ...valid, date: dateFromToday(-1) }, times).date).toMatch(/past/i);
  });

  test('accepts today', () => {
    expect(validateBooking({ ...valid, date: dateFromToday(0) }, times).date).toBeUndefined();
  });

  test('rejects impossible dates', () => {
    expect(validateBooking({ ...valid, date: '2030-02-31' }, times).date).toMatch(/valid date/i);
  });

  test('rejects a time that is not offered', () => {
    expect(validateBooking({ ...valid, time: '03:00' }, times).time).toMatch(/not available/i);
  });

  test.each([['0'], ['-2'], [String(MAX_GUESTS + 1)]])('rejects %s guests', (guests) => {
    expect(validateBooking({ ...valid, guests }, times).guests).toMatch(/between 1 and 10/);
  });

  test('rejects fractional guests', () => {
    expect(validateBooking({ ...valid, guests: '2.5' }, times).guests).toMatch(/whole number/i);
  });

  test('accepts the guest limits', () => {
    expect(validateBooking({ ...valid, guests: '1' }, times).guests).toBeUndefined();
    expect(validateBooking({ ...valid, guests: String(MAX_GUESTS) }, times).guests).toBeUndefined();
  });

  test('rejects an unknown occasion', () => {
    expect(validateBooking({ ...valid, occasion: 'Hacking' }, times).occasion).toMatch(/listed/i);
  });
});
