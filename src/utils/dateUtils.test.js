import { parseDateString, toDateString, formatLongDate } from './dateUtils';

test('parseDateString parses valid local dates', () => {
  const d = parseDateString('2030-06-15');
  expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2030, 5, 15]);
});

test.each(['', null, 'abc', '2030-6-1', '2030-02-31', '2030-13-01'])(
  'parseDateString returns null for %p',
  (value) => expect(parseDateString(value)).toBeNull()
);

test('toDateString round-trips', () => {
  expect(toDateString(new Date(2030, 0, 5))).toBe('2030-01-05');
});

test('formatLongDate formats or falls back to the raw value', () => {
  expect(formatLongDate('2030-06-15')).toMatch(/Saturday.*15.*June.*2030/);
  expect(formatLongDate('garbage')).toBe('garbage');
});
