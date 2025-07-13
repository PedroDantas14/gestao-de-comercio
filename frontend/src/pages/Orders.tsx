import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Order } from '../types';
import { Eye, Edit, ClipboardList } from 'lucide-react';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders.sort((a: Order, b: Order) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Processando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregue';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os pedidos</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card 
              key={order.id} 
              className={`hover:shadow-lg transition-shadow duration-200 cursor-pointer border-l-4 ${
                selectedOrder?.id === order.id ? 'ring-2 ring-primary-500 border-l-primary-500' : 'border-l-accent-400'
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
                    <ClipboardList className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Pedido #{order.id}</h3>
                    <p className="text-sm text-gray-500">{order.customerName}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    R$ {order.total.toFixed(2)}
                  </p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <Card className="text-center py-12">
            <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-500">Os pedidos aparecerão aqui quando forem criados</p>
          </Card>
        )}
      </div>

      <div>
        {selectedOrder ? (
          <Card title={`Pedido #${selectedOrder.id}`}>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cliente</h4>
                <p className="text-gray-600">{selectedOrder.customerName}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="pending">Pendente</option>
                  <option value="processing">Processando</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregue</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Itens do Pedido</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity}x R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">
                        R$ {item.total.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>R$ {selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Criado em: {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Detalhes do Pedido</h3>
            <p className="text-gray-500">Selecione um pedido para ver os detalhes</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Orders;