import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { Cliente, Produto, Pedido, PedidoProduto, Empresa } from '../types';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Cliente[]>([]);
  const [products, setProducts] = useState<Produto[]>([]);
  const [companies, setCompanies] = useState<Empresa[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [orderItems, setOrderItems] = useState<PedidoProduto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    loadCustomers();
    loadProducts();
    loadCompanies();
    generateOrderNumber();
  }, []);

  const loadCustomers = () => {
    const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    setCustomers(storedCustomers);
  };

  const loadProducts = () => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  };
  
  const loadCompanies = () => {
    const storedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    setCompanies(storedCompanies);
  };
  
  const generateOrderNumber = () => {
    // Gera um número de pedido único baseado na data e hora atual
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    setOrderNumber(`PED-${timestamp}-${random}`);
  };

  const addProduct = () => {
    if (!selectedProduct || quantity <= 0) return;

    const product = products.find(p => p.nome === selectedProduct);
    if (!product) return;

    const existingItem = orderItems.find(item => item.produto === selectedProduct);
    
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.produto === selectedProduct
          ? { 
              ...item, 
              quantidade: item.quantidade + quantity
            }
          : item
      ));
    } else {
      const newItem: PedidoProduto = {
        pedido: orderNumber,
        produto: product.nome,
        quantidade: quantity
      };
      setOrderItems([...orderItems, newItem]);
    }

    setSelectedProduct('');
    setQuantity(1);
  };

  const removeProduct = (productName: string) => {
    setOrderItems(orderItems.filter(item => item.produto !== productName));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => {
      const product = products.find(p => p.nome === item.produto);
      return sum + (product ? product.valor * item.quantidade : 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer || !selectedCompany || orderItems.length === 0) {
      alert('Selecione um cliente, uma empresa e adicione pelo menos um produto');
      return;
    }

    const customer = customers.find(c => c.nome === selectedCustomer);
    if (!customer) return;

    // Criar novo pedido conforme o diagrama
    const newOrder: Pedido = {
      numero: orderNumber,
      cliente: selectedCustomer,
      empresa: selectedCompany,
      observacao: observation,
      data: new Date().toISOString()
    };

    // Salvar pedido
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Salvar produtos do pedido
    const orderProductsStorage = JSON.parse(localStorage.getItem('orderProducts') || '[]');
    orderProductsStorage.push(...orderItems);
    localStorage.setItem('orderProducts', JSON.stringify(orderProductsStorage));

    alert('Pedido criado com sucesso!');
    navigate('/orders');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Novo Pedido</h1>
        <p className="text-gray-600 mt-2">Crie um novo pedido para seus clientes</p>
      </div>
      
      {customers.length === 0 ? (
        <Card className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente cadastrado</h3>
          <p className="text-gray-500 mb-4">Você precisa cadastrar clientes para criar pedidos</p>
          <Button onClick={() => navigate('/customers')}>
            Cadastrar Cliente
          </Button>
        </Card>
      ) : products.length === 0 ? (
        <Card className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto cadastrado</h3>
          <p className="text-gray-500 mb-4">Você precisa cadastrar produtos para criar pedidos</p>
          <Button onClick={() => navigate('/products')}>
            Cadastrar Produto
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Informações do Pedido">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número do Pedido
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    disabled
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente
                  </label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {customers.map((customer, index) => (
                      <option key={index} value={customer.nome}>
                        {customer.nome}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione uma empresa</option>
                    {companies.map((company, index) => (
                      <option key={index} value={company.nomeFantasia}>
                        {company.nomeFantasia}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observação
                  </label>
                  <textarea
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adicionar Produtos
                  </label>
                  <div className="flex items-end gap-2">
                    <div className="flex-grow">
                      <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Selecione um produto</option>
                        {products.map((product, index) => (
                          <option key={index} value={product.nome}>
                            {product.nome} - R$ {product.valor.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addProduct}
                      disabled={!selectedProduct}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {orderItems.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Itens do Pedido</h3>
                    <div className="space-y-2">
                      {orderItems.map((item, index) => {
                        const product = products.find(p => p.nome === item.produto);
                        const price = product ? product.valor : 0;
                        const subtotal = price * item.quantidade;
                        
                        return (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{item.produto}</p>
                              <p className="text-sm text-gray-500">
                                {item.quantidade}x R$ {price.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="font-medium text-gray-900">
                                R$ {subtotal.toFixed(2)}
                              </p>
                              <Button
                                size="sm"
                                variant="danger"
                                type="button"
                                onClick={() => removeProduct(item.produto)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-end mt-4">
                      <div className="bg-gray-100 px-4 py-2 rounded-lg">
                        <p className="text-lg font-semibold">Total: R$ {calculateTotal().toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 mt-6">
                  <Button type="submit" className="flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Finalizar Pedido
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => navigate('/orders')}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card title="Resumo do Pedido">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Número</h3>
                  <p className="font-medium">{orderNumber}</p>
                </div>
                
                {selectedCustomer && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
                    <p className="font-medium">{selectedCustomer}</p>
                  </div>
                )}
                
                {selectedCompany && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Empresa</h3>
                    <p className="font-medium">{selectedCompany}</p>
                  </div>
                )}
                
                {orderItems.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Itens</h3>
                    <p className="font-medium">{orderItems.length} produtos</p>
                    <p className="font-bold mt-2">Total: R$ {calculateTotal().toFixed(2)}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewOrder;