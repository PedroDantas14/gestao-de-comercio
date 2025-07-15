import api from './api';
import { Cliente } from '../types';

const ClienteService = {
  async getAll(): Promise<Cliente[]> {
    try {
      const response = await api.get('/clientes');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar clientes:', error.response?.data || error.message);
      throw error;
    }
  },

  async getById(id: string): Promise<Cliente> {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao buscar cliente ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  async create(data: Cliente): Promise<Cliente> {
    try {
      // Verificar se o token está disponível antes de fazer a requisição
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token não encontrado no localStorage');
        throw new Error('Você precisa estar autenticado para criar um cliente');
      }

      console.log('Enviando dados do cliente:', data);
      const response = await api.post('/clientes', data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error.response?.data || error.message);
      throw error;
    }
  },

  async update(id: string, data: Cliente): Promise<Cliente> {
    try {
      const response = await api.put(`/clientes/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao atualizar cliente ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/clientes/${id}`);
    } catch (error: any) {
      console.error(`Erro ao excluir cliente ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }
};

export default ClienteService;
