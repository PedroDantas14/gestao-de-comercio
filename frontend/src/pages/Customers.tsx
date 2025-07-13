import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Cliente, Empresa } from '../types';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Cliente[]>([]);
  const [companies, setCompanies] = useState<Empresa[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: ''
  });

  useEffect(() => {
    loadCustomers();
    loadCompanies();
  }, []);

  const loadCustomers = () => {
    const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    setCustomers(storedCustomers);
  };

  const loadCompanies = () => {
    const storedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    setCompanies(storedCompanies);
  };

  const saveCustomers = (updatedCustomers: Cliente[]) => {
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    setCustomers(updatedCustomers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCustomer) {
      // Como não temos mais IDs, vamos usar o índice para atualizar
      const index = customers.findIndex(customer => 
        customer.nome === editingCustomer.nome && 
        customer.email === editingCustomer.email
      );
      
      if (index !== -1) {
        const updatedCustomers = [...customers];
        updatedCustomers[index] = { ...formData };
        saveCustomers(updatedCustomers);
      }
    } else {
      const newCustomer: Cliente = {
        ...formData
      };
      saveCustomers([...customers, newCustomer]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      empresa: ''
    });
    setEditingCustomer(null);
    setShowForm(false);
  };

  const handleEdit = (customer: Cliente) => {
    setFormData({
      nome: customer.nome,
      email: customer.email,
      telefone: customer.telefone,
      empresa: customer.empresa
    });
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      const updatedCustomers = [...customers];
      updatedCustomers.splice(index, 1);
      saveCustomers(updatedCustomers);
    }
  };

  // Não precisamos mais dessa função, pois agora armazenamos o nome da empresa diretamente

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">Gerencie sua base de clientes</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {showForm && (
        <Card title={editingCustomer ? 'Editar Cliente' : 'Novo Cliente'} className="mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome Completo"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              required
            />
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              <select
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Selecione uma empresa</option>
                {companies.map((company, index) => (
                  <option key={index} value={company.nomeFantasia}>
                    {company.nomeFantasia}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit">
                {editingCustomer ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{customer.nome}</h3>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleEdit(customer)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Email:</span> {customer.email}</p>
              <p><span className="font-medium">Telefone:</span> {customer.telefone}</p>
              <p><span className="font-medium">Empresa:</span> {customer.empresa}</p>
            </div>
          </Card>
        ))}
      </div>

      {customers.length === 0 && !showForm && (
        <Card className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente cadastrado</h3>
          <p className="text-gray-500 mb-4">Comece criando seu primeiro cliente</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Customers;