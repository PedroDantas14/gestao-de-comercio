import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { Building2, Package, Users, ShoppingCart, DollarSign, Loader, RefreshCw } from 'lucide-react';
import EmpresaService from '../services/empresa.service';
import ProdutoService from '../services/produto.service';
import ClienteService from '../services/cliente.service';
import PedidoService from '../services/pedido.service';
import Button from '../components/Button';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    companies: 0,
    products: 0,
    customers: 0,
    orders: 0,
    revenue: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Buscar dados da API
      const [empresas, produtos, clientes, pedidos] = await Promise.all([
        EmpresaService.getAll(),
        ProdutoService.getAll(),
        ClienteService.getAll(),
        PedidoService.getAll()
      ]);
      
      // Calcular receita total baseada nos pedidos
      const revenue = pedidos.reduce((sum, pedido) => {
        return sum + (pedido.valorTotal || 0);
      }, 0);
      
      setStats({
        companies: empresas.length,
        products: produtos.length,
        customers: clientes.length,
        orders: pedidos.length,
        revenue,
      });
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Erro ao carregar dados. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Empresas',
      value: stats.companies,
      icon: Building2,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      title: 'Produtos',
      value: stats.products,
      icon: Package,
      color: 'text-accent-600',
      bgColor: 'bg-accent-100',
    },
    {
      title: 'Clientes',
      value: stats.customers,
      icon: Users,
      color: 'text-primary-700',
      bgColor: 'bg-primary-200',
    },
    {
      title: 'Pedidos',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'text-accent-700',
      bgColor: 'bg-accent-200',
    },
    {
      title: 'Faturamento',
      value: `R$ ${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-accent-600',
      bgColor: 'bg-accent-100',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral do seu negócio</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="w-8 h-8 animate-spin text-accent-600" />
          <span className="ml-2 text-gray-600">Carregando dados...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 mb-4">
          <p>{error}</p>
          <Button onClick={loadDashboardData} className="mt-2 flex items-center" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="transition-transform duration-200 hover:scale-105">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;