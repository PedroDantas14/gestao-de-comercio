import api from './api';
import { Empresa } from '../types';

const EmpresaService = {
  async getAll(): Promise<Empresa[]> {
    const response = await api.get('/empresas');
    return response.data;
  },

  async getById(id: string): Promise<Empresa> {
    const response = await api.get(`/empresas/${id}`);
    return response.data;
  },

  async create(data: Empresa): Promise<Empresa> {
    const response = await api.post('/empresas', data);
    return response.data;
  },

  async update(id: string, data: Empresa): Promise<Empresa> {
    const response = await api.put(`/empresas/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/empresas/${id}`);
  }
};

export default EmpresaService;
