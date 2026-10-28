import React from 'react';
import { Link } from '../router/Router';
import { formatLongDate } from '../utils/dateUtils';

/**
 * Shown after a successful booking. If someone opens this URL directly (no
 * booking in memory, e.g. after a page refresh) we explain instead of showing blanks.
 */
function ConfirmedBooking({ booking }) {
  if (!booking) {
    return (
      <section className="container message-page">
        <h1>No booking found</h1>
        <p>We couldn’t find a recent reservation. Please make a new one.</p>
        <Link to="/booking" className="button button--primary">
          Reserve a Table
        </Link>
      </section>
    );
  }

  return (
    <section className="container message-page" aria-labelledby="confirmed-title">
      <h1 id="confirmed-title">Booking confirmed!</h1>
      <p>Thank you – your table at Little Lemon is reserved.</p>
      <dl className="summary">
        <div>
          <dt>Date</dt>
          <dd>{formatLongDate(booking.date)}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{booking.time}</dd>
        </div>
        <div>
          <dt>Guests</dt>
          <dd>{booking.guests}</dd>
        </div>
        <div>
          <dt>Occasion</dt>
          <dd>{booking.occasion}</dd>
        </div>
      </dl>
      <Link to="/" className="button button--secondary">
        Back to home
      </Link>
    </section>
  );
}

export default ConfirmedBooking;
