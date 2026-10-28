import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router, Routes, Route, Link, getBasename } from './Router';

const OLD = process.env.PUBLIC_URL;
afterEach(() => {
  process.env.PUBLIC_URL = OLD;
});

function Demo() {
  return (
    <Router>
      <Link to="/booking">go</Link>
      <Link to="/#about">about</Link>
      <Routes>
        <Route path="/" element={<p>home page</p>} />
        <Route path="/booking" element={<p>booking page</p>} />
        <Route path="*" element={<p>not found</p>} />
      </Routes>
    </Router>
  );
}

describe('Router with a base path (GitHub Pages)', () => {
  beforeEach(() => {
    process.env.PUBLIC_URL = '/little_lemon';
  });

  test('normalises the base path', () => {
    process.env.PUBLIC_URL = '/little_lemon/';
    expect(getBasename()).toBe('/little_lemon');
  });

  test('the base URL itself shows the home route', () => {
    window.history.pushState({}, '', '/little_lemon/');
    render(<Demo />);
    expect(screen.getByText('home page')).toBeInTheDocument();
  });

  test('a direct visit to a sub-route works', () => {
    window.history.pushState({}, '', '/little_lemon/booking');
    render(<Demo />);
    expect(screen.getByText('booking page')).toBeInTheDocument();
  });

  test('links include the base path and navigation keeps it', () => {
    window.history.pushState({}, '', '/little_lemon/');
    render(<Demo />);
    expect(screen.getByRole('link', { name: 'go' })).toHaveAttribute('href', '/little_lemon/booking');
    expect(screen.getByRole('link', { name: 'about' })).toHaveAttribute('href', '/little_lemon/#about');
    userEvent.click(screen.getByRole('link', { name: 'go' }));
    expect(window.location.pathname).toBe('/little_lemon/booking');
    expect(screen.getByText('booking page')).toBeInTheDocument();
  });

  test('unknown paths fall back to the not-found route', () => {
    window.history.pushState({}, '', '/little_lemon/nope');
    render(<Demo />);
    expect(screen.getByText('not found')).toBeInTheDocument();
  });
});
