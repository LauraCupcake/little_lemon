import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { dateFromToday } from './test-utils';
import { fetchAPI } from './api/bookingApi';
import { parseDateString } from './utils/dateUtils';

/** Mounts the whole app at the given URL path. */
function renderApp(path = '/') {
  window.history.pushState({}, '', path);
  return render(<App />);
}

describe('App – home page', () => {
  test('renders the landmarks and main sections', () => {
    renderApp('/');
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    expect(screen.getByRole('heading', { level: 1, name: /little lemon/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /this week’s specials/i })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  test('every image has an alt attribute', () => {
    renderApp('/');
    document.querySelectorAll('img').forEach((img) => expect(img).toHaveAttribute('alt'));
  });

  test('has a skip link pointing at the main content', () => {
    renderApp('/');
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main');
  });
});

describe('App – navigation', () => {
  test('"Reserve a Table" opens the booking page without a full reload', () => {
    renderApp('/');
    userEvent.click(screen.getByRole('link', { name: /reserve a table/i }));
    expect(window.location.pathname).toBe('/booking');
    expect(screen.getByRole('heading', { name: /reserve a table/i })).toBeInTheDocument();
  });

  test('unfinished sections show a "coming soon" page', () => {
    renderApp('/menu');
    expect(screen.getByRole('heading', { name: /menu/i })).toBeInTheDocument();
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });

  test('unknown URLs show a 404 page with a way home', () => {
    renderApp('/does-not-exist');
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
  });

  test('mobile menu toggle updates aria-expanded', () => {
    renderApp('/');
    const toggle = screen.getByRole('button', { name: /open menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(toggle);
    expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('App – booking flow (integration)', () => {
  test('a visitor can book a table and see the confirmation', async () => {
    renderApp('/booking');
    const day = dateFromToday(2);
    fireEvent.change(screen.getByLabelText(/^date/i), { target: { value: day } });

    // The time options come from the (mock) API for the chosen day.
    const slots = fetchAPI(parseDateString(day));
    expect(slots.length).toBeGreaterThan(0); // guard: deterministic data has slots for this offset
    fireEvent.change(screen.getByLabelText(/^time/i), { target: { value: slots[0] } });
    fireEvent.change(screen.getByLabelText(/number of guests/i), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/occasion/i), { target: { value: 'Birthday' } });
    userEvent.click(screen.getByRole('button', { name: /make your reservation/i }));

    expect(await screen.findByRole('heading', { name: /booking confirmed/i })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/booking-confirmed');
    expect(screen.getByText(slots[0])).toBeInTheDocument();
    expect(screen.getByText('Birthday')).toBeInTheDocument();
  });

  test('opening the confirmation URL directly explains there is no booking', () => {
    renderApp('/booking-confirmed');
    expect(screen.getByRole('heading', { name: /no booking found/i })).toBeInTheDocument();
  });

  test('invalid submissions stay on the booking page', async () => {
    renderApp('/booking');
    userEvent.click(screen.getByRole('button', { name: /make your reservation/i }));
    await waitFor(() => expect(screen.getByText(/please choose a date/i)).toBeInTheDocument());
    expect(window.location.pathname).toBe('/booking');
  });
});
