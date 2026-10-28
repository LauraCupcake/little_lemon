import React from 'react';
import { render } from '@testing-library/react';
import { Router } from './router/Router';

/** Renders a component inside the app Router, starting at `path`. */
export function renderAt(ui, path = '/') {
  window.history.pushState({}, '', path);
  return render(<Router>{ui}</Router>);
}

/** Returns the "YYYY-MM-DD" string for today + `days` (local time). */
export function dateFromToday(days = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
