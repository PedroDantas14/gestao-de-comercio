import api from './api';
import { Cliente } from '../types';

const ClienteService = {
  async getAll(): Promise<Cliente[]> {
    const response = await api.get('/clientes');
    return response.data;
  },

  async getById(id: string): Promise<Cliente> {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  async create(data: Cliente): Promise<Cliente> {
    const response = await api.post('/clientes', data);
    return response.data;
  },

  async update(id: string, data: Cliente): Promise<Cliente> {
    const response = await api.put(`/clientes/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/clientes/${id}`);
  }
};

export default ClienteService;
