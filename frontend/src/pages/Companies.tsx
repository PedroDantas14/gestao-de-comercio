import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Empresa } from '../types';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Empresa[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Empresa | null>(null);
  const [formData, setFormData] = useState({
    nomeFantasia: '',
    razaoSocial: '',
    cnpj: ''
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    const storedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    setCompanies(storedCompanies);
  };

  const saveCompanies = (updatedCompanies: Empresa[]) => {
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));
    setCompanies(updatedCompanies);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCompany) {
      // Como não temos mais IDs, vamos usar o índice para atualizar
      const index = companies.findIndex(company => 
        company.nomeFantasia === editingCompany.nomeFantasia && 
        company.cnpj === editingCompany.cnpj
      );
      
      if (index !== -1) {
        const updatedCompanies = [...companies];
        updatedCompanies[index] = { ...formData };
        saveCompanies(updatedCompanies);
      }
    } else {
      const newCompany: Empresa = {
        ...formData
      };
      saveCompanies([...companies, newCompany]);
    }

    resetForm();
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

  const handleDelete = (index: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      const updatedCompanies = [...companies];
      updatedCompanies.splice(index, 1);
      saveCompanies(updatedCompanies);
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
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

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
            
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit">
                {editingCompany ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                  <Building2 className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{company.nomeFantasia}</h3>
                  <p className="text-sm text-gray-500">{company.cnpj}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleEdit(company)}
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
              <p><span className="font-medium">Razão Social:</span> {company.razaoSocial}</p>
              <p><span className="font-medium">CNPJ:</span> {company.cnpj}</p>
            </div>
          </Card>
        ))}
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