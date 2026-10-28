# Little Lemon 🍋

A responsive React web app for **Little Lemon**, a family owned Mediterranean restaurant in Chicago.
Visitors can browse this week's specials and **reserve a table online** with a validated booking form.

Built for the Meta Front-End Developer Capstone, following the Little Lemon style guide
(see [`docs/design/ui-kit.jpg`](docs/design/ui-kit.jpg)).

## Features

- **Home page** – hero with call to action, weekly specials cards, "About us" section.
- **Booking form** (`/booking`) – date, time, number of guests and occasion with:
  - available times that change with the selected date,
  - inline, accessible validation messages (on blur and on submit),
  - protection against double submission,
  - friendly handling of "fully booked" dates and API failures.
- **Confirmation page** (`/booking-confirmed`) summarising the reservation.
- **404 and "coming soon" pages** so no link is ever a dead end.
- **Responsive** layout (desktop, tablet, mobile) with a collapsible mobile menu.

## Getting started

### Prerequisites
- [Node.js](https://nodejs.org/) 18 or newer (includes npm)
- Git

### Install and run

```bash
git clone <your-repository-url>
cd little_lemon
npm install
npm start          # http://localhost:3000
```

### Other scripts

| Command           | What it does                                          |
| ----------------- | ----------------------------------------------------- |
| `npm start`       | Starts the dev server with hot reload                 |
| `npm test`        | Runs the unit tests in watch mode                     |
| `CI=true npm test`| Runs the unit tests once (for CI / a quick check)     |
| `npm run build`   | Creates an optimised production build in `build/`     |

> **Deploying the build:** the app uses the browser History API for routes such as `/booking`,
> so the host must serve `index.html` for unknown paths (a "single-page app" fallback).
> To try it locally: `npx serve -s build`.

## Project structure

```
src/
├── api/            bookingApi.js        Mock API: fetchAPI(date), submitAPI(data)
├── assets/         images/ icons/       Optimised images and SVG icons
├── components/     Header, Nav, Hero, Specials, About, Footer, BookingForm
├── pages/          HomePage, BookingPage, ConfirmedBooking, MessagePage
├── reducers/       availableTimes.js    initializeTimes + updateTimes reducer
├── router/         Router.js            Small History-API router (Router, Routes, Route, Link)
├── styles/         base.css, home.css, booking.css   (design tokens live in base.css)
├── utils/          validation.js, dateUtils.js
├── App.js          Layout + routes
└── *.test.js       Unit and integration tests, next to the code they test
docs/design/        Style guide used as the design reference
```

### How booking works

1. `BookingPage` keeps the available times in a reducer (`reducers/availableTimes.js`).
2. Choosing a date dispatches `UPDATE_TIMES`, which calls `fetchAPI` for that date.
3. `BookingForm` validates with `utils/validation.js`. When valid, `submitAPI` is called.
4. On success the app navigates to the confirmation page.

The API is **mocked** (`src/api/bookingApi.js`) with the same function names as the capstone API.
To connect a real back end, only that file needs to change.

## Validation rules

| Field    | Rule                                                           |
| -------- | -------------------------------------------------------------- |
| Date     | Required, a real calendar date, not in the past                |
| Time     | Required, must be one of the slots offered for that date       |
| Guests   | Required, whole number from 1 to 10                            |
| Occasion | Required, one of Birthday / Anniversary / Engagement / Other   |

## Accessibility

- Semantic landmarks: `header`, `nav` (labelled), `main`, `footer`, `section` with headings, `article` cards.
- "Skip to main content" link and visible focus outlines for keyboard users.
- Every form control has a `<label>`; errors use `aria-invalid`, `aria-describedby` and `role="alert"`;
  focus moves to the first invalid field on submit.
- Mobile menu button uses `aria-expanded`, `aria-controls` and a changing `aria-label`.
- Meaningful `alt` text for content images; decorative icons use `alt=""`.
- Colours chosen for AA contrast; `prefers-reduced-motion` respected.

## Testing

```bash
CI=true npm test
```

Tests use Jest and React Testing Library and cover the mock API, reducer, validation and date
helpers, the booking form (rendering, attributes, validation, error and edge cases), navigation,
and a full booking flow from the home page to the confirmation.

## Design reference

Colours `#495E57` (green), `#F4CE14` (yellow), `#EE9972`, `#FBDABB`, `#EDEFEE`, `#333333`;
fonts **Markazi Text** (headings) and **Karla** (body); 16px rounded corners.

## Assumptions and limitations

- Bookings are not stored anywhere – the API is a mock and the confirmation is kept in memory only.
- Menu, Order Online and Login are placeholders ("coming soon").
- Fonts load from Google Fonts; the app falls back to Georgia / system fonts when offline.
