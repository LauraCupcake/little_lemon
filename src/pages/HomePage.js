import React from 'react';
import Hero from '../components/Hero';
import Specials from '../components/Specials';
import About from '../components/About';

/** Landing page: hero, weekly specials and about us. */
function HomePage() {
  return (
    <>
      <Hero />
      <Specials />
      <About />
    </>
  );
}

export default HomePage;
