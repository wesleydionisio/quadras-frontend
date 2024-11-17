import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import ReviewPage from './pages/ReviewPage';
import Header from './components/global/Header';
import Footer from './components/global/Footer';
import ReservationReview from './pages/ReservationReview';


const AppRoutes = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking/:quadraId" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reservation-review" element={<ReservationReview />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRoutes;