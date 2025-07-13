import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { Customer, Product, Order, OrderItem } from '../types';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadCustomers();
    loadProducts();
  }, []);

  const loadCustomers = () => {
    const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    setCustomers(storedCustomers);
  };

  const loadProducts = () => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  };

  const addProduct = () => {
    if (!selectedProduct || quantity <= 0) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    if (quantity > product.stock) {
      alert('Quantidade indisponível no estoque');
      return;
    }

    const existingItem = orderItems.find(item => item.productId === selectedProduct);
    
    if (existingItem) {
      if (existingItem.quantity + quantity > product.stock) {
        alert('Quantidade total excede o estoque disponível');
        return;
      }
      
      setOrderItems(orderItems.map(item =>
        item.productId === selectedProduct
          ? { 
              ...item, 
              quantity: item.quantity + quantity,
              total: (item.quantity + quantity) * item.price
            }
          : item
      ));
    } else {
      const newItem: OrderItem = {
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
        total: quantity * product.price,
      };
      setOrderItems([...orderItems, newItem]);
    }

    setSelectedProduct('');
    setQuantity(1);
  };

  const removeProduct = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer || orderItems.length === 0) {
      alert('Selecione um cliente e adicione pelo menos um produto');
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomer);
    if (!customer) return;

    // Update product stock
    const updatedProducts = products.map(product => {
      const orderItem = orderItems.find(item => item.productId === product.id);
      if (orderItem) {
        return { ...product, stock: product.stock - orderItem.quantity };
      }
      return product;
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    // Create new order
    const newOrder: Order = {
      id: Date.now().toString(),
      customerId: customer.id,
      customerName: customer.name,
      companyId: customer.companyId,
      items: orderItems,
      total: calculateTotal(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    alert('Pedido criado com sucesso!');
    navigate('/orders');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Novo Pedido</h1>
        <p className="text-gray-600 mt-2">Crie um novo pedido para seus clientes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Informações do Cliente">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Selecione um cliente</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.email}
                </option>
              ))}
            </select>
          </div>
        </Card>

        <Card title="Adicionar Produtos">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produto
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Selecione um produto</option>
                {products.filter(p => p.stock > 0).map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - R$ {product.price.toFixed(2)} (Estoque: {product.stock})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                onClick={addProduct}
                className="w-full flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          {orderItems.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qtd
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço Unit.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderItems.map((item) => (
                    <tr key={item.productId}>
                      <td className="px-4 py-4 text-sm text-gray-900">{item.productName}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">R$ {item.price.toFixed(2)}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">R$ {item.total.toFixed(2)}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => removeProduct(item.productId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {orderItems.length > 0 && (
          <Card title="Resumo do Pedido">
            <div className="flex justify-between items-center text-lg font-semibold mb-4">
              <span>Total do Pedido:</span>
              <span>R$ {calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Finalizar Pedido
              </Button>
              <Button variant="secondary" onClick={() => navigate('/orders')}>
                Cancelar
              </Button>
            </div>
          </Card>
        )}
      </form>

      {customers.length === 0 && (
        <Card className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente cadastrado</h3>
          <p className="text-gray-500 mb-4">Você precisa cadastrar clientes para criar pedidos</p>
          <Button onClick={() => navigate('/customers')}>
            Cadastrar Cliente
          </Button>
        </Card>
      )}

      {products.length === 0 && customers.length > 0 && (
        <Card className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto cadastrado</h3>
          <p className="text-gray-500 mb-4">Você precisa cadastrar produtos para criar pedidos</p>
          <Button onClick={() => navigate('/products')}>
            Cadastrar Produto
          </Button>
        </Card>
      )}
    </div>
  );
};

export default NewOrder;