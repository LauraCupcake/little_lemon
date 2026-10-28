import React, { useState } from 'react';
import { Link } from '../router/Router';
import hamburger from '../assets/icons/hamburger.svg';

/** Main navigation links, shared by the header and (as plain data) the footer. */
export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/#about' },
  { label: 'Menu', to: '/menu' },
  { label: 'Reservations', to: '/booking' },
  { label: 'Order Online', to: '/order-online' },
  { label: 'Login', to: '/login' },
];

/**
 * Primary navigation. On small screens the links collapse behind a toggle
 * button that exposes its state to assistive technology via aria-expanded.
 */
function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav" aria-label="Main navigation">
      <button
        type="button"
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="nav-links"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((o) => !o)}
      >
        <img src={hamburger} alt="" width="28" height="20" />
      </button>

      <ul id="nav-links" className={`nav__links${open ? ' nav__links--open' : ''}`}>
        {NAV_LINKS.map(({ label, to }) => (
          <li key={label}>
            <Link to={to} onClick={() => setOpen(false)}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
