import React from 'react';
import imageA from '../assets/images/mario-adrian-a.jpg';
import imageB from '../assets/images/mario-adrian-b.jpg';

/** "About us" section (target of the #about nav link). */
function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="container about__inner">
        <div className="about__text">
          <h2 id="about-title">Little Lemon</h2>
          <p className="subtitle subtitle--dark">Chicago</p>
          <p>
            Little Lemon is owned by two Italian brothers, Mario and Adrian, who moved
            to the United States to pursue their shared dream of owning a restaurant.
            To craft the menu, Mario relies on family recipes and his experience as a
            chef in Italy, while Adrian does the marketing and design.
          </p>
        </div>
        <div className="about__images">
          <img
            src={imageA}
            alt="Mario and Adrian working together in the kitchen"
            className="about__image about__image--back"
            loading="lazy"
          />
          <img
            src={imageB}
            alt="Mario and Adrian smiling at the restaurant"
            className="about__image about__image--front"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

export default About;
