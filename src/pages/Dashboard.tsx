import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { Building2, Package, Users, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';
import { Company, Product, Customer, Order } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    companies: 0,
    products: 0,
    customers: 0,
    orders: 0,
    revenue: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    const companies: Company[] = JSON.parse(localStorage.getItem('companies') || '[]');
    const products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
    const customers: Customer[] = JSON.parse(localStorage.getItem('customers') || '[]');
    const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');

    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;

    setStats({
      companies: companies.length,
      products: products.length,
      customers: customers.length,
      orders: orders.length,
      revenue,
      pendingOrders,
    });
  }, []);

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
    {
      title: 'Pedidos Pendentes',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral do seu negócio</p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Atividade Recente">
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-primary-50 rounded-lg">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Sistema iniciado</p>
                <p className="text-xs text-gray-500">Bem-vindo ao CommerceApp</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-accent-50 rounded-lg">
              <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Dados carregados</p>
                <p className="text-xs text-gray-500">Informações atualizadas</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Status do Sistema">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-accent-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-accent-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-900">Sistema Online</span>
              </div>
              <span className="text-xs text-accent-600 font-medium">Operacional</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-900">Base de Dados</span>
              </div>
              <span className="text-xs text-primary-600 font-medium">Conectado</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;