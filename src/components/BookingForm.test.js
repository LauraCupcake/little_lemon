import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingForm from './BookingForm';
import { dateFromToday } from '../test-utils';

const TIMES = ['17:00', '18:30', '20:00'];

/** Renders the form with sensible defaults. */
function setup(props = {}) {
  const submitForm = jest.fn().mockReturnValue(true);
  const onDateChange = jest.fn();
  render(
    <BookingForm
      availableTimes={TIMES}
      onDateChange={onDateChange}
      submitForm={submitForm}
      {...props}
    />
  );
  return { submitForm, onDateChange };
}

const submitButton = () => screen.getByRole('button', { name: /make your reservation/i });

/** Fills in every field with valid data. */
function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/^date/i), { target: { value: dateFromToday(2) } });
  fireEvent.change(screen.getByLabelText(/^time/i), { target: { value: '18:30' } });
  fireEvent.change(screen.getByLabelText(/number of guests/i), { target: { value: '4' } });
  fireEvent.change(screen.getByLabelText(/occasion/i), { target: { value: 'Anniversary' } });
}

describe('BookingForm – rendering & accessibility', () => {
  test('renders every field with an accessible label', () => {
    setup();
    expect(screen.getByLabelText(/^date/i)).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText(/^time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toHaveAttribute('type', 'number');
    expect(screen.getByLabelText(/occasion/i)).toBeInTheDocument();
    expect(submitButton()).toBeInTheDocument();
  });

  test('applies HTML5 validation attributes', () => {
    setup();
    const date = screen.getByLabelText(/^date/i);
    const guests = screen.getByLabelText(/number of guests/i);
    expect(date).toBeRequired();
    expect(date).toHaveAttribute('min', dateFromToday(0));
    expect(guests).toBeRequired();
    expect(guests).toHaveAttribute('min', '1');
    expect(guests).toHaveAttribute('max', '10');
    expect(screen.getByLabelText(/^time/i)).toBeRequired();
    expect(screen.getByLabelText(/occasion/i)).toBeRequired();
  });

  test('exposes the form as a named landmark', () => {
    setup();
    expect(screen.getByRole('form', { name: /table reservation/i })).toBeInTheDocument();
  });

  test('time select is disabled until a date is chosen, then lists the slots', () => {
    setup();
    const time = screen.getByLabelText(/^time/i);
    expect(time).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/^date/i), { target: { value: dateFromToday(1) } });
    expect(time).toBeEnabled();
    TIMES.forEach((t) => expect(screen.getByRole('option', { name: t })).toBeInTheDocument());
  });
});

describe('BookingForm – behaviour', () => {
  test('notifies the parent when the date changes', () => {
    const { onDateChange } = setup();
    const day = dateFromToday(1);
    fireEvent.change(screen.getByLabelText(/^date/i), { target: { value: day } });
    expect(onDateChange).toHaveBeenCalledWith(day);
  });

  test('clears the chosen time when the date changes', () => {
    setup();
    fillValidForm();
    expect(screen.getByLabelText(/^time/i)).toHaveValue('18:30');
    fireEvent.change(screen.getByLabelText(/^date/i), { target: { value: dateFromToday(3) } });
    expect(screen.getByLabelText(/^time/i)).toHaveValue('');
  });

  test('submits the data when the form is valid', async () => {
    const { submitForm } = setup();
    fillValidForm();
    userEvent.click(submitButton());
    await waitFor(() => expect(submitForm).toHaveBeenCalledTimes(1));
    expect(submitForm).toHaveBeenCalledWith({
      date: dateFromToday(2),
      time: '18:30',
      guests: 4,
      occasion: 'Anniversary',
    });
  });
});

describe('BookingForm – validation & error messages', () => {
  test('shows an error for each empty field and does not submit', async () => {
    const { submitForm } = setup();
    userEvent.click(submitButton());
    expect(await screen.findByText(/please choose a date/i)).toBeInTheDocument();
    expect(screen.getByText(/please select a time/i)).toBeInTheDocument();
    expect(screen.getByText(/please select an occasion/i)).toBeInTheDocument();
    expect(submitForm).not.toHaveBeenCalled();
  });

  test('moves focus to the first invalid field', () => {
    setup();
    userEvent.click(submitButton());
    expect(screen.getByLabelText(/^date/i)).toHaveFocus();
  });

  test('links the error message to the field for screen readers', () => {
    setup();
    userEvent.click(submitButton());
    const date = screen.getByLabelText(/^date/i);
    expect(date).toHaveAttribute('aria-invalid', 'true');
    expect(date).toHaveAccessibleDescription(/please choose a date/i);
  });

  test('rejects a date in the past', () => {
    setup();
    const date = screen.getByLabelText(/^date/i);
    fireEvent.change(date, { target: { value: dateFromToday(-2) } });
    fireEvent.blur(date);
    expect(screen.getByText(/cannot be in the past/i)).toBeInTheDocument();
  });

  test.each([['0'], ['11'], ['2.5']])('rejects %s guests on blur', (value) => {
    setup();
    const guests = screen.getByLabelText(/number of guests/i);
    fireEvent.change(guests, { target: { value } });
    fireEvent.blur(guests);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('does not show errors before the user has interacted', () => {
    setup();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('clears an error once the value is corrected', () => {
    setup();
    const guests = screen.getByLabelText(/number of guests/i);
    fireEvent.change(guests, { target: { value: '99' } });
    fireEvent.blur(guests);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    fireEvent.change(guests, { target: { value: '5' } });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('BookingForm – edge cases', () => {
  test('tells the user when a date is fully booked', () => {
    setup({ availableTimes: [] });
    fireEvent.change(screen.getByLabelText(/^date/i), { target: { value: dateFromToday(1) } });
    expect(screen.getByRole('status')).toHaveTextContent(/fully booked/i);
    expect(screen.getByLabelText(/^time/i)).toBeDisabled();
  });

  test('shows a message when the times could not be loaded', () => {
    setup({ availableTimes: [], timesError: 'Sorry, we could not load the available times.' });
    expect(screen.getByRole('alert')).toHaveTextContent(/could not load/i);
  });

  test('shows an error when the booking is rejected', async () => {
    const { submitForm } = setup({ submitForm: jest.fn().mockReturnValue(false) });
    fillValidForm();
    userEvent.click(submitButton());
    expect(await screen.findByText(/could not complete your booking/i)).toBeInTheDocument();
  });

  test('shows an error when submitting throws', async () => {
    setup({ submitForm: jest.fn().mockRejectedValue(new Error('boom')) });
    fillValidForm();
    userEvent.click(submitButton());
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });

  test('prevents double submission while a booking is in progress', async () => {
    let resolve;
    const submitForm = jest.fn(() => new Promise((r) => { resolve = r; }));
    setup({ submitForm });
    fillValidForm();
    userEvent.click(submitButton());
    await waitFor(() => expect(screen.getByRole('button', { name: /booking/i })).toBeDisabled());
    userEvent.click(screen.getByRole('button', { name: /booking/i }));
    expect(submitForm).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolve(true);
    });
  });
});
