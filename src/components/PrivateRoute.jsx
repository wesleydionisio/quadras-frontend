// src/components/PrivateRoute.jsx

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Você pode exibir um spinner ou qualquer outro indicador de carregamento aqui
    return <div>Carregando...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;