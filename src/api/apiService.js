// src/api/apiService.js
import axios from 'axios';

// Cria uma instância do Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Inclui /api
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com respostas de erro 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Remover token e redirecionar para login se o token for inválido ou expirado
      localStorage.removeItem('authToken');
      window.location.href = '/login'; // Alternativamente, use useNavigate em componentes React
    }
    return Promise.reject(error);
  }
);

export default api;