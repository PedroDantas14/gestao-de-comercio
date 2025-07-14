import api from './api';
import { Produto } from '../types';

const ProdutoService = {
  async getAll(): Promise<Produto[]> {
    try {
      const response = await api.get('/produtos');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar produtos:', error.response?.data || error.message);
      throw error;
    }
  },

  async getById(id: string): Promise<Produto> {
    try {
      const response = await api.get(`/produtos/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao buscar produto ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  async create(data: Produto): Promise<Produto> {
    try {
      // Verificar se o token está disponível antes de fazer a requisição
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token não encontrado no localStorage');
        throw new Error('Você precisa estar autenticado para criar um produto');
      }

      const response = await api.post('/produtos', data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar produto:', error.response?.data || error.message);
      throw error;
    }
  },

  async update(id: string, data: Produto): Promise<Produto> {
    try {
      const response = await api.put(`/produtos/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao atualizar produto ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/produtos/${id}`);
    } catch (error: any) {
      console.error(`Erro ao excluir produto ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }
};

export default ProdutoService;
