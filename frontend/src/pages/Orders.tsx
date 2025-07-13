import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Pedido, Cliente, PedidoProduto, Produto } from '../types';
import { Eye, ClipboardList } from 'lucide-react';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null);
  const [orderProducts, setOrderProducts] = useState<PedidoProduto[]>([]);
  const [products, setProducts] = useState<Produto[]>([]);
  const [customers, setCustomers] = useState<Cliente[]>([]);
  // Removemos o estado de empresas já que não estamos usando diretamente

  useEffect(() => {
    loadOrders();
    loadOrderProducts();
    loadProducts();
    loadCustomers();
  }, []);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders.sort((a: Pedido, b: Pedido) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    ));
  };

  const loadOrderProducts = () => {
    const storedOrderProducts = JSON.parse(localStorage.getItem('orderProducts') || '[]');
    setOrderProducts(storedOrderProducts);
  };

  const loadProducts = () => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  };

  const loadCustomers = () => {
    const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    setCustomers(storedCustomers);
  };

  // Removemos a função loadCompanies já que não estamos usando empresas diretamente

  // No diagrama não há status de pedido, então removemos essa função

  // Simplificamos para mostrar apenas a data do pedido
  const getOrderDateColor = (date: string) => {
    const orderDate = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'bg-green-100 text-green-800'; // Hoje
    if (diffDays < 7) return 'bg-blue-100 text-blue-800';   // Última semana
    if (diffDays < 30) return 'bg-yellow-100 text-yellow-800'; // Último mês
    return 'bg-gray-100 text-gray-800'; // Mais antigo
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCustomerName = (customerRef: string) => {
    const customer = customers.find(c => c.nome === customerRef);
    return customer ? customer.nome : 'Cliente não encontrado';
  };

  const getOrderProducts = (orderNumber: string) => {
    return orderProducts.filter(op => op.pedido === orderNumber);
  };

  const getProductName = (productRef: string) => {
    const product = products.find(p => p.nome === productRef);
    return product ? product.nome : 'Produto não encontrado';
  };

  const calculateOrderTotal = (orderNumber: string) => {
    const orderItems = orderProducts.filter(op => op.pedido === orderNumber);
    let total = 0;
    
    orderItems.forEach(item => {
      const product = products.find(p => p.nome === item.produto);
      if (product) {
        total += product.valor * item.quantidade;
      }
    });
    
    return total.toFixed(2);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600 mt-2">Gerencie seus pedidos</p>
        </div>
        <Button
          onClick={() => window.location.href = '/orders/new'}
          className="flex items-center"
        >
          <ClipboardList className="w-4 h-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      {selectedOrder ? (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Detalhes do Pedido #{selectedOrder.numero}</h2>
            <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
              Voltar para lista
            </Button>
          </div>
          
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Informações do Pedido</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Número do Pedido:</span> #{selectedOrder.numero}</p>
                  <p><span className="font-medium">Cliente:</span> {getCustomerName(selectedOrder.cliente)}</p>
                  <p><span className="font-medium">Empresa:</span> {selectedOrder.empresa}</p>
                  <p><span className="font-medium">Data do Pedido:</span> {formatDate(selectedOrder.data)}</p>
                  <p><span className="font-medium">Observação:</span> {selectedOrder.observacao || 'Nenhuma'}</p>
                  <p><span className="font-medium">Valor Total:</span> R$ {calculateOrderTotal(selectedOrder.numero)}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium text-gray-900 mb-4">Itens do Pedido</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Unitário</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getOrderProducts(selectedOrder.numero).map((item, index) => {
                      const product = products.find(p => p.nome === item.produto);
                      const price = product ? product.valor : 0;
                      return (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm">{getProductName(item.produto)}</td>
                          <td className="px-4 py-3 text-sm">{item.quantidade}</td>
                          <td className="px-4 py-3 text-sm">R$ {price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm">R$ {(price * item.quantidade).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-medium">Total:</td>
                      <td className="px-4 py-3 font-medium">R$ {calculateOrderTotal(selectedOrder.numero)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order, index) => (
            <div key={index} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => setSelectedOrder(order)}>
              <Card>
                <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
                    <ClipboardList className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Pedido #{order.numero}</h3>
                    <p className="text-sm text-gray-500">{getCustomerName(order.cliente)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">R$ {calculateOrderTotal(order.numero)}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.data)}</p>
                  </div>
                  <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getOrderDateColor(order.data)}`}>
                    {formatDate(order.data)}
                  </div>
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              </Card>
            </div>
          ))}
          
          {orders.length === 0 && (
            <Card className="text-center py-12">
              <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-500 mb-4">Comece criando seu primeiro pedido</p>
              <Button onClick={() => window.location.href = '/orders/new'}>
                <ClipboardList className="w-4 h-4 mr-2" />
                Novo Pedido
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;