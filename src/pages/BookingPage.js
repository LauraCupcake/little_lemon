import React, { useReducer } from 'react';
import BookingForm from '../components/BookingForm';
import { submitAPI } from '../api/bookingApi';
import { initializeTimes, updateTimes, UPDATE_TIMES } from '../reducers/availableTimes';
import { useRouter } from '../router/Router';

/**
 * Reservations page. Owns the available-times state (via a reducer) and
 * hands the booking to the API; on success it navigates to the confirmation page.
 *
 * @param {{ onBooked: (booking: object) => void }} props
 */
function BookingPage({ onBooked }) {
  const { navigate } = useRouter();
  const [state, dispatch] = useReducer(updateTimes, undefined, initializeTimes);

  const submitForm = (formData) => {
    const accepted = submitAPI(formData);
    if (accepted) {
      onBooked(formData);
      navigate('/booking-confirmed');
    }
    return accepted;
  };

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h1>Reserve a table</h1>
          <p className="lead">Tell us when you’re coming and we’ll save you a seat.</p>
        </div>
      </section>
      <section className="container booking" aria-label="Booking form">
        <BookingForm
          availableTimes={state.times}
          timesError={state.error}
          onDateChange={(date) => dispatch({ type: UPDATE_TIMES, date })}
          submitForm={submitForm}
        />
      </section>
    </>
  );
}

export default BookingPage;
