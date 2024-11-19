// src/routes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/.ProfilePage';
import ReservationReview from './pages/ReservationReview';
import Header from './components/global/Header';
import Footer from './components/global/Footer';
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<LoginPage />} />
        
        {/* Rotas privadas */}
        <Route 
          path="/booking/:quadraId" 
          element={
            <PrivateRoute>
              <BookingPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/perfil" 
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/reservas/:reservationId" 
          element={
            <PrivateRoute>
              <ReservationReview />
            </PrivateRoute>
          } 
        />
      </Routes>
      <Footer />
    </>
  );
};

export default AppRoutes;