import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/apiService';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.get('/users/profile');
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          setUser(null);
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        setUser(null);
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro no login' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};