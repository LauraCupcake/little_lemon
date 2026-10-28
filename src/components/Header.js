import React from 'react';
import { Link } from '../router/Router';
import Nav from './Nav';
import logo from '../assets/icons/logo.svg';

/** Site header: logo (links home) + main navigation. */
function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__logo" aria-label="Little Lemon – home">
          <img src={logo} alt="Little Lemon" width="148" height="40" />
        </Link>
        <Nav />
      </div>
    </header>
  );
}

export default Header;
