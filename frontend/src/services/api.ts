import axios, { InternalAxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:3000/api';

// Cria uma instância do axios com a URL base
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  
  // Log da requisição para debug
  console.log(`Fazendo requisição para: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  
  if (token && config.headers) {
    // Adiciona o token no formato correto para autenticação JWT
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token JWT adicionado à requisição');
  } else {
    console.warn('Token não encontrado no localStorage ou headers não disponíveis');
    // Se não estiver autenticado e a rota não for de autenticação, redirecionar para login
    if (!config.url?.includes('/auth/') && typeof window !== 'undefined') {
      console.warn('Tentando acessar rota protegida sem autenticação');
      // Comentado para não interferir no fluxo atual
      // window.location.href = '/login';
    }
  }
  
  return config;
}, (error) => {
  console.error('Erro no interceptor de requisição:', error);
  return Promise.reject(error);
});

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    // Resposta bem-sucedida
    return response;
  },
  (error) => {
    // Tratar erros de resposta
    if (error.response) {
      // Erro de autenticação (401) ou autorização (403)
      if (error.response.status === 401 || error.response.status === 403) {
        console.error('Erro de autenticação:', error.response.data);
        // Comentado para não interferir no fluxo atual
        // localStorage.removeItem('token');
        // localStorage.removeItem('currentUser');
        // if (typeof window !== 'undefined') {
        //   window.location.href = '/login';
        // }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
