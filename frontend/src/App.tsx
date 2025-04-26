import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import TourDetailPage from './pages/TourDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tour/:id" element={<TourDetailPage />} />
          <Route path="/checkout/:id" element={<CheckoutPage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
