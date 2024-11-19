import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import PerfilPage from './pages/PerfilPage';
import ReservationReview from './pages/ReservationReview';
import Header from './components/global/Header';
import Footer from './components/global/Footer';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <BrowserRouter>
      <SnackbarProvider>
        <AuthProvider>
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
                    <PerfilPage />
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
        </AuthProvider>
      </SnackbarProvider>
    </BrowserRouter>
  );
};

export default App;