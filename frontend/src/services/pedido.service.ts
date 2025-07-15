import api from './api';
import { Pedido, PedidoProduto } from '../types';

interface PedidoCompleto extends Pedido {
  produtos: PedidoProduto[];
}

const PedidoService = {
  async getAll(): Promise<Pedido[]> {
    const response = await api.get('/pedidos');
    return response.data;
  },

  async getById(id: string): Promise<PedidoCompleto> {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  async create(data: PedidoCompleto): Promise<Pedido> {
    const response = await api.post('/pedidos', data);
    return response.data;
  },

  async update(id: string, data: PedidoCompleto): Promise<Pedido> {
    const response = await api.put(`/pedidos/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/pedidos/${id}`);
  }
};

export default PedidoService;
