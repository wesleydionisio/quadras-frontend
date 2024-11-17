// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/apiService'; // Certifique-se de que esta é a instância correta do axios

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Definir o token nos headers do axios (já feito pelo interceptor)
        // Chamar a API para obter os dados do usuário
        const response = await axios.get('/users/profile'); // Corrigir a rota
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          setUser(null);
          localStorage.removeItem('authToken');
          delete axios.defaults.headers.common['Authorization'];
        }
      } catch (error) {
        console.error('Erro ao carregar o usuário:', error);
        setUser(null);
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  // Função para login
  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro no login. Tente novamente.' };
    }
  };

  // Função para logout
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Função para registrar um novo usuário
  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { success: false, message: 'Erro no cadastro. Tente novamente.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};