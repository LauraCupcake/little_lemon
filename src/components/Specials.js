import React from 'react';
import { Link } from '../router/Router';
import greekSalad from '../assets/images/greek-salad.jpg';
import bruschetta from '../assets/images/bruschetta.jpg';
import lemonDessert from '../assets/images/lemon-dessert.jpg';
import basket from '../assets/icons/basket.svg';

/** This week's featured dishes. Kept as data so adding a dish is a one-line change. */
export const SPECIALS = [
  {
    name: 'Greek Salad',
    price: '$12.99',
    image: greekSalad,
    description:
      'The famous Greek salad of crispy lettuce, peppers, olives and our Chicago style feta cheese, garnished with crunchy garlic and rosemary croutons.',
  },
  {
    name: 'Bruschetta',
    price: '$5.99',
    image: bruschetta,
    description:
      'Our bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil.',
  },
  {
    name: 'Lemon Dessert',
    price: '$5.00',
    image: lemonDessert,
    description:
      'This comes straight from grandma’s recipe book, every last ingredient has been sourced and is as authentic as can be imagined.',
  },
];

/** "This week's specials" section. */
function Specials() {
  return (
    <section id="specials" className="specials" aria-labelledby="specials-title">
      <div className="container">
        <div className="specials__header">
          <h2 id="specials-title">This week’s specials!</h2>
          <Link to="/menu" className="button button--primary">
            Online Menu
          </Link>
        </div>

        <ul className="specials__grid">
          {SPECIALS.map(({ name, price, image, description }) => (
            <li key={name}>
              <article className="card">
                <img src={image} alt={name} className="card__image" loading="lazy" />
                <div className="card__body">
                  <div className="card__header">
                    <h3>{name}</h3>
                    <p className="card__price">{price}</p>
                  </div>
                  <p>{description}</p>
                  <Link to="/order-online" className="card__delivery">
                    Order a delivery <img src={basket} alt="" width="24" height="24" />
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Specials;
