import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Cliente, Empresa } from '../types';
import { Plus, Edit, Trash2, Users, Loader2 } from 'lucide-react';
import ClienteService from '../services/cliente.service';
import EmpresaService from '../services/empresa.service';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Cliente[]>([]);
  const [companies, setCompanies] = useState<Empresa[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  // Função para formatar telefone: (XX) XXXXX-XXXX
  const formatTelefone = (value: string | undefined | null): string => {
    // Se o valor for nulo ou indefinido, retorna string vazia
    if (value === null || value === undefined) {
      return '';
    }
    
    // Remove todos os caracteres não numéricos
    const digits = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (com DDD)
    const limitedDigits = digits.slice(0, 11);
    
    // Aplica a máscara
    if (limitedDigits.length <= 2) {
      return `(${limitedDigits}`;
    } else if (limitedDigits.length <= 7) {
      return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2)}`;
    } else {
      return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2, 7)}-${limitedDigits.slice(7)}`;
    }
  };
  
  // Função para remover a formatação do telefone
  const removeTelefoneFormat = (telefone: string | undefined | null): string => {
    if (telefone === null || telefone === undefined) {
      return '';
    }
    return telefone.replace(/\D/g, '');
  };

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ClienteService.getAll();
      setCustomers(data);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Não foi possível carregar os clientes. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      const data = await EmpresaService.getAll();
      setCompanies(data);
    } catch (err) {
      console.error('Erro ao carregar empresas:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Verificar se o token está disponível
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Você precisa estar autenticado para adicionar ou editar clientes');
      setLoading(false);
      return;
    }
    
    try {
      // Cria uma cópia do formData com o telefone sem formatação
      const dataToSubmit = {
        ...formData,
        telefone: removeTelefoneFormat(formData.telefone)
      };
      
      console.log('Dados do formulário:', dataToSubmit);
      
      if (editingCustomer && editingCustomer._id) {
        // Atualizar cliente existente
        await ClienteService.update(editingCustomer._id, dataToSubmit);
      } else {
        // Criar novo cliente
        await ClienteService.create(dataToSubmit);
      }
      
      // Recarregar a lista de clientes
      await loadCustomers();
      resetForm();
    } catch (err: any) {
      console.error('Erro ao salvar cliente:', err);
      // Verificar se o erro tem uma resposta do servidor com mensagem
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Erro: ${err.response.data.message}`);
      } else {
        setError('Erro ao salvar cliente. Verifique se o servidor está rodando.');
      }
    } finally {
      setLoading(false);
    }
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
      telefone: formatTelefone(customer.telefone),
      empresa: typeof customer.empresa === 'string' ? customer.empresa : (customer.empresa as Empresa)?._id || ''
    });
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        setLoading(true);
        setError('');
        await ClienteService.delete(id);
        await loadCustomers();
      } catch (err) {
        console.error('Erro ao excluir cliente:', err);
        setError('Erro ao excluir cliente. Verifique se o servidor está rodando.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">Gerencie seus clientes</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Novo Cliente
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

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
              onChange={(e) => setFormData({ ...formData, telefone: formatTelefone(e.target.value) })}
              placeholder="(XX) XXXXX-XXXX"
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
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
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
                  onClick={() => handleDelete(customer._id || '')}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Email:</span> {customer.email}</p>
              <p><span className="font-medium">Telefone:</span> {formatTelefone(customer.telefone)}</p>
              <p><span className="font-medium">Empresa:</span> {
                typeof customer.empresa === 'string' ? 
                  companies.find(c => c._id === customer.empresa)?.nomeFantasia || customer.empresa : 
                  (customer.empresa as Empresa)?.nomeFantasia || ''
              }</p>
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