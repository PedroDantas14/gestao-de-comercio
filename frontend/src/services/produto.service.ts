import api from './api';
import { Produto } from '../types';

const ProdutoService = {
  async getAll(): Promise<Produto[]> {
    const response = await api.get('/produtos');
    return response.data;
  },

  async getById(id: string): Promise<Produto> {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  },

  async create(data: Produto): Promise<Produto> {
    const response = await api.post('/produtos', data);
    return response.data;
  },

  async update(id: string, data: Produto): Promise<Produto> {
    const response = await api.put(`/produtos/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/produtos/${id}`);
  }
};

export default ProdutoService;
