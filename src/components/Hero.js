import React from 'react';
import { Link } from '../router/Router';
import heroImage from '../assets/images/hero-chef.jpg';

/** Home page banner with the main call to action. */
function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 id="hero-title">Little Lemon</h1>
          <p className="subtitle">Chicago</p>
          <p className="lead">
            We are a family owned Mediterranean restaurant, focused on traditional
            recipes served with a modern twist.
          </p>
          <Link to="/booking" className="button button--primary">
            Reserve a Table
          </Link>
        </div>
        <img
          className="hero__image"
          src={heroImage}
          alt="A Little Lemon chef plating a Mediterranean dish"
          width="900"
          height="600"
        />
      </div>
    </section>
  );
}

export default Hero;
