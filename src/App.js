import React, { useState } from 'react';
import { Router, Routes, Route } from './router/Router';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import ConfirmedBooking from './pages/ConfirmedBooking';
import MessagePage from './pages/MessagePage';

/** Sections that are not built yet share one friendly placeholder. */
const comingSoon = (title) => (
  <MessagePage title={title}>This page is coming soon. Thanks for your patience!</MessagePage>
);

function App() {
  // The most recent confirmed booking, shared with the confirmation page.
  const [booking, setBooking] = useState(null);

  return (
    <Router>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main" tabIndex="-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage onBooked={setBooking} />} />
          <Route path="/booking-confirmed" element={<ConfirmedBooking booking={booking} />} />
          <Route path="/menu" element={comingSoon('Menu')} />
          <Route path="/order-online" element={comingSoon('Order Online')} />
          <Route path="/login" element={comingSoon('Login')} />
          <Route
            path="*"
            element={
              <MessagePage title="Page not found">
                Sorry, we couldn’t find the page you were looking for.
              </MessagePage>
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
