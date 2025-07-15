import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Empresa } from '../types';
import { Plus, Edit, Trash2, Building2, Loader2 } from 'lucide-react';
import EmpresaService from '../services/empresa.service';

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Empresa[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nomeFantasia: '',
    razaoSocial: '',
    cnpj: ''
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await EmpresaService.getAll();
      setCompanies(data);
    } catch (err) {
      console.error('Erro ao carregar empresas:', err);
      setError('Não foi possível carregar as empresas. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (editingCompany && editingCompany._id) {
        // Atualizar empresa existente
        await EmpresaService.update(editingCompany._id, formData);
      } else {
        // Criar nova empresa
        await EmpresaService.create(formData);
      }
      
      // Recarregar a lista de empresas
      await loadCompanies();
      resetForm();
    } catch (err) {
      console.error('Erro ao salvar empresa:', err);
      setError('Erro ao salvar empresa. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nomeFantasia: '',
      razaoSocial: '',
      cnpj: ''
    });
    setEditingCompany(null);
    setShowForm(false);
  };

  const handleEdit = (company: Empresa) => {
    setFormData({
      nomeFantasia: company.nomeFantasia,
      razaoSocial: company.razaoSocial,
      cnpj: company.cnpj
    });
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      try {
        setLoading(true);
        setError('');
        await EmpresaService.delete(id);
        await loadCompanies();
      } catch (err) {
        console.error('Erro ao excluir empresa:', err);
        setError('Erro ao excluir empresa. Verifique se o servidor está rodando.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
          <p className="text-gray-600 mt-2">Gerencie suas empresas</p>
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
          Nova Empresa
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <Card title={editingCompany ? 'Editar Empresa' : 'Nova Empresa'} className="mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <Input
              label="Nome Fantasia"
              value={formData.nomeFantasia}
              onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
              required
            />
            <Input
              label="Razão Social"
              value={formData.razaoSocial}
              onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
              required
            />
            <Input
              label="CNPJ"
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              required
            />
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button type="button" variant="secondary" onClick={resetForm} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {editingCompany ? 'Atualizar' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && companies.length === 0 ? (
          <div className="col-span-3 text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Loader2 className="w-12 h-12 mx-auto text-gray-400 animate-spin" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Carregando empresas...</h3>
          </div>
        ) : companies.length === 0 ? (
          <div className="col-span-3 text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Building2 className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma empresa cadastrada</h3>
            <p className="mt-2 text-sm text-gray-500">Clique em "Nova Empresa" para começar.</p>
          </div>
        ) : (
          companies.map((company) => (
            <Card key={company._id} className="relative">
              <div className="absolute top-4 right-4 flex space-x-1">
                <button
                  onClick={() => handleEdit(company)}
                  className="p-1 rounded-full hover:bg-gray-100"
                  disabled={loading}
                >
                  <Edit className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleDelete(company._id || '')}
                  className="p-1 rounded-full hover:bg-gray-100"
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
              <h3 className="text-lg font-medium text-gray-900">{company.nomeFantasia}</h3>
              <p className="text-sm text-gray-500 mt-1">{company.razaoSocial}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-900">CNPJ</p>
                <p className="text-sm text-gray-600">{company.cnpj}</p>
              </div>
            </Card>
          ))
        )}
      </div>

      {companies.length === 0 && !showForm && (
        <Card className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma empresa cadastrada</h3>
          <p className="text-gray-500 mb-4">Comece criando sua primeira empresa</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Empresa
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Companies;