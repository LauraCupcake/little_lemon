import React from 'react';
import { Link } from '../router/Router';
import { NAV_LINKS } from './Nav';
import logo from '../assets/icons/logo.svg';

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com' },
  { label: 'Instagram', href: 'https://www.instagram.com' },
  { label: 'X (Twitter)', href: 'https://x.com' },
];

/** Site footer with sitemap, contact details and social links. */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <img src={logo} alt="Little Lemon" width="148" height="40" />

        <section aria-labelledby="footer-nav">
          <h2 id="footer-nav">Sitemap</h2>
          <ul>
            {NAV_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="footer-contact">
          <h2 id="footer-contact">Contact</h2>
          <address>
            <p>123 Main Street, Chicago, IL</p>
            <p>
              <a href="tel:+13125550123">(312) 555-0123</a>
            </p>
            <p>
              <a href="mailto:contact@littlelemon.com">contact@littlelemon.com</a>
            </p>
          </address>
        </section>

        <section aria-labelledby="footer-social">
          <h2 id="footer-social">Social Media</h2>
          <ul>
            {SOCIAL_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </footer>
  );
}

export default Footer;
