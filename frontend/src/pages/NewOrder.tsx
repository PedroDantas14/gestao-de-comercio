import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { Cliente, Produto, PedidoProduto, Empresa } from '../types';
import { Plus, Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import ClienteService from '../services/cliente.service';
import ProdutoService from '../services/produto.service';
import EmpresaService from '../services/empresa.service';
import PedidoService from '../services/pedido.service';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCustomers();
    loadProducts();
    loadCompanies();
    generateOrderNumber();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ClienteService.getAll();
      setCustomers(data);
      console.log('Clientes carregados:', data);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Não foi possível carregar os clientes. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await ProdutoService.getAll();
      setProducts(data);
      console.log('Produtos carregados:', data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }
  };
  
  const loadCompanies = async () => {
    try {
      const data = await EmpresaService.getAll();
      setCompanies(data);
      console.log('Empresas carregadas:', data);
    } catch (err) {
      console.error('Erro ao carregar empresas:', err);
    }
  };
  
  const generateOrderNumber = () => {
    // Gera um número de pedido único baseado na data e hora atual
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    setOrderNumber(`PED-${timestamp}-${random}`);
  };

  const addProduct = () => {
    if (!selectedProduct || quantity <= 0) return;

    const product = products.find(p => p._id === selectedProduct);
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
      // Encontrar o produto selecionado para obter seu valor
      const selectedProductObj = products.find(p => p._id === selectedProduct);
      if (!selectedProductObj) return;
      
      const newItem: PedidoProduto = {
        pedido: orderNumber,
        produto: selectedProduct, // Usar o ID do produto
        quantidade: quantity,
        valorUnitario: selectedProductObj.valor // Incluir o valor unitário do produto
      };
      setOrderItems([...orderItems, newItem]);
    }

    setSelectedProduct('');
    setQuantity(1);
  };

  const removeProduct = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.produto !== productId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => {
      if (!item || !item.produto) return sum;
      const product = products.find(p => p._id === item.produto);
      return sum + (product && product.valor ? product.valor * (item.quantidade || 1) : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer || !selectedCompany || orderItems.length === 0) {
      alert('Selecione um cliente, uma empresa e adicione pelo menos um produto');
      return;
    }

    // Encontrar os objetos completos de cliente e empresa pelos IDs selecionados
    const customer = customers.find(c => c._id === selectedCustomer);
    const company = companies.find(c => c._id === selectedCompany);
    
    if (!customer || !company) {
      alert('Cliente ou empresa não encontrados');
      return;
    }

    try {
      setLoading(true);
      
      // Calcular o valor total do pedido
      const valorTotal = calculateTotal();
      
      // Criar novo pedido com os IDs corretos
      const newOrder = {
        numero: orderNumber,
        cliente: customer._id as string, // Usar o ID do cliente como string
        empresa: company._id as string, // Usar o ID da empresa como string
        observacao: observation,
        data: new Date().toISOString(),
        valorTotal: valorTotal, // Incluir o valor total do pedido
        produtos: orderItems.map(item => {
          // Encontrar o produto para garantir que temos o valor unitário
          const product = products.find(p => p._id === item.produto);
          return {
            pedido: orderNumber,
            produto: item.produto as string, // Garantir que seja string
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario || (product ? product.valor : 0) // Usar o valor unitário do item ou do produto
          };
        })
      };

      console.log('Enviando pedido:', newOrder);
      
      // Enviar pedido para a API
      await PedidoService.create(newOrder);
      
      alert('Pedido criado com sucesso!');
      navigate('/orders');
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert(`Erro ao criar pedido: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Novo Pedido</h1>
        <p className="text-gray-600 mt-2">Crie um novo pedido para seus clientes</p>
      </div>
      
      {loading ? (
        <Card className="text-center py-12">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <p>Carregando clientes...</p>
          </div>
        </Card>
      ) : error ? (
        <Card className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600 mb-2">Erro ao carregar dados</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => loadCustomers()}>
            Tentar novamente
          </Button>
        </Card>
      ) : customers.length === 0 ? (
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
                    {customers.map((customer) => (
                      <option key={customer._id} value={customer._id || ''}>
                        {customer.nome || 'Sem nome'} - {customer.email || 'Sem email'}
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
                    {companies.map((company) => (
                      <option key={company._id} value={company._id || ''}>
                        {company.nomeFantasia || 'Sem nome fantasia'} - {company.razaoSocial || 'Sem razão social'}
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
                        {products.map((product) => (
                          <option key={product._id} value={product._id || ''}>
                            {product.nome || 'Produto sem nome'} - R$ {product.valor ? product.valor.toFixed(2) : '0.00'}
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
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Itens do Pedido</h3>
                  
                  <div className="space-y-3">
                    {orderItems.map((item, index) => {
                      const product = products.find(p => p._id === item.produto);
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{product?.nome || 'Produto não encontrado'}</h4>
                            <p className="text-sm text-gray-500">
                              {item.quantidade || 1} x R$ {product?.valor ? product.valor.toFixed(2) : '0.00'}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <p className="font-medium mr-4">
                              R$ {((product?.valor || 0) * (item.quantidade || 1)).toFixed(2)}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeProduct(String(item.produto))}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
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
                    <p className="font-medium">
                      {customers.find(c => c._id === selectedCustomer)?.nome || 'Cliente não encontrado'}
                    </p>
                  </div>
                )}
                
                {selectedCompany && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Empresa</h3>
                    <p className="font-medium">
                      {companies.find(c => c._id === selectedCompany)?.nomeFantasia || 'Empresa não encontrada'}
                    </p>
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