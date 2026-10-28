import React from 'react';
import { Link } from '../router/Router';

/** Simple page for "coming soon" sections and the 404 fallback. */
function MessagePage({ title, children }) {
  return (
    <section className="container message-page">
      <h1>{title}</h1>
      <p>{children}</p>
      <Link to="/" className="button button--primary">
        Back to home
      </Link>
    </section>
  );
}

export default MessagePage;
