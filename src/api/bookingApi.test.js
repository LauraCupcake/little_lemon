import { fetchAPI, submitAPI } from './bookingApi';

describe('fetchAPI', () => {
  test('returns an array of "HH:MM" slots between 17:00 and 23:30', () => {
    const slots = fetchAPI(new Date(2030, 5, 15));
    expect(Array.isArray(slots)).toBe(true);
    slots.forEach((slot) => expect(slot).toMatch(/^(17|18|19|20|21|22|23):(00|30)$/));
  });

  test('is deterministic for the same date', () => {
    expect(fetchAPI(new Date(2030, 5, 15))).toEqual(fetchAPI(new Date(2030, 5, 15)));
  });

  test('throws a TypeError for invalid input', () => {
    expect(() => fetchAPI('2030-06-15')).toThrow(TypeError);
    expect(() => fetchAPI(new Date('nope'))).toThrow(TypeError);
  });
});

describe('submitAPI', () => {
  test('accepts a complete booking', () => {
    expect(submitAPI({ date: '2030-06-15', time: '18:00', guests: 2, occasion: 'Birthday' })).toBe(true);
  });

  test('rejects missing or incomplete data', () => {
    expect(submitAPI(undefined)).toBe(false);
    expect(submitAPI({ date: '2030-06-15' })).toBe(false);
  });
});
