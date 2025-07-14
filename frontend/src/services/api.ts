import axios, { InternalAxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:3000/api';

// Cria uma instância do axios com a URL base
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token adicionado à requisição:', token);
  } else {
    console.warn('Token não encontrado no localStorage ou headers não disponíveis');
  }
  
  return config;
}, (error) => {
  console.error('Erro no interceptor de requisição:', error);
  return Promise.reject(error);
});

export default api;
