import React, { useRef, useState } from 'react';
import { MAX_GUESTS, MIN_GUESTS, OCCASIONS, validateBooking } from '../utils/validation';
import { todayString } from '../utils/dateUtils';

const INITIAL_VALUES = { date: '', time: '', guests: '1', occasion: '' };
const FIELD_ORDER = ['date', 'time', 'guests', 'occasion'];

/**
 * Table reservation form.
 *
 * Props:
 *  - availableTimes: string[]        slots offered for the selected date
 *  - timesError:     string | null   message if the slots could not be loaded
 *  - onDateChange:   (date) => void  called when the date changes so the parent can reload slots
 *  - submitForm:     (values) => boolean | Promise<boolean>  true when the booking was accepted
 *
 * Validation runs when a field loses focus and again on submit. Errors are tied
 * to their inputs with aria-describedby / aria-invalid so screen readers announce them.
 */
function BookingForm({ availableTimes = [], timesError = null, onDateChange, submitForm }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const refs = {
    date: useRef(null),
    time: useRef(null),
    guests: useRef(null),
    occasion: useRef(null),
  };

  const errors = validateBooking(values, availableTimes);
  // Only show an error once the user has interacted with that field (or tried to submit).
  const visibleError = (name) => (touched[name] ? errors[name] : undefined);

  const noTimesForDate =
    values.date && !errors.date && !timesError && availableTimes.length === 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSubmitError('');
    if (name === 'date') {
      // A new date means a different set of slots, so clear the old choice.
      setValues((v) => ({ ...v, date: value, time: '' }));
      if (onDateChange) onDateChange(value);
    } else {
      setValues((v) => ({ ...v, [name]: value }));
    }
  };

  const handleBlur = (event) => {
    setTouched((t) => ({ ...t, [event.target.name]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return; // guard against double submits

    setTouched({ date: true, time: true, guests: true, occasion: true });
    const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
    if (firstInvalid) {
      refs[firstInvalid].current.focus();
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      const accepted = await submitForm({ ...values, guests: Number(values.guests) });
      if (!accepted) {
        setSubmitError(
          'We could not complete your booking. Please check your details and try again.'
        );
      }
    } catch (err) {
      setSubmitError('Something went wrong while booking. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  /** Shared attributes that wire an input to its error message. */
  const fieldProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    ref: refs[name],
    'aria-invalid': visibleError(name) ? 'true' : 'false',
    'aria-describedby': visibleError(name) ? `${name}-error` : undefined,
  });

  const renderError = (name) =>
    visibleError(name) ? (
      <p id={`${name}-error`} className="form__error" role="alert">
        {visibleError(name)}
      </p>
    ) : null;

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate aria-label="Table reservation">
      <div className="form__field">
        <label htmlFor="date">Date</label>
        <input type="date" required min={todayString()} {...fieldProps('date')} />
        {renderError('date')}
      </div>

      <div className="form__field">
        <label htmlFor="time">Time</label>
        <select required disabled={!values.date || availableTimes.length === 0} {...fieldProps('time')}>
          <option value="">
            {values.date ? 'Select a time' : 'Choose a date first'}
          </option>
          {availableTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        {renderError('time')}
        {timesError && (
          <p className="form__error" role="alert">
            {timesError}
          </p>
        )}
        {noTimesForDate && (
          <p className="form__hint" role="status">
            Sorry, we are fully booked on this date. Please choose another day.
          </p>
        )}
      </div>

      <div className="form__field">
        <label htmlFor="guests">Number of guests</label>
        <input
          type="number"
          required
          min={MIN_GUESTS}
          max={MAX_GUESTS}
          step="1"
          inputMode="numeric"
          {...fieldProps('guests')}
        />
        {renderError('guests')}
      </div>

      <div className="form__field">
        <label htmlFor="occasion">Occasion</label>
        <select required {...fieldProps('occasion')}>
          <option value="">Select an occasion</option>
          {OCCASIONS.map((occasion) => (
            <option key={occasion} value={occasion}>
              {occasion}
            </option>
          ))}
        </select>
        {renderError('occasion')}
      </div>

      {submitError && (
        <p className="form__error form__error--summary" role="alert">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        className="button button--primary"
        disabled={submitting}
      >
        {submitting ? 'Booking…' : 'Make Your Reservation'}
      </button>
    </form>
  );
}

export default BookingForm;
