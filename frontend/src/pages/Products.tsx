import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Produto, Empresa } from '../types';
import { Plus, Edit, Trash2, Package, Loader2 } from 'lucide-react';
import ProdutoService from '../services/produto.service';
import EmpresaService from '../services/empresa.service';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Produto[]>([]);
  const [companies, setCompanies] = useState<Empresa[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valor: '',
    empresa: ''
  });

  useEffect(() => {
    loadProducts();
    loadCompanies();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ProdutoService.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setError('Não foi possível carregar os produtos. Verifique se o servidor está rodando.');
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
    
    try {
      const produtoData = {
        nome: formData.nome,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor) || 0,
        empresa: formData.empresa
      };
      
      if (editingProduct && editingProduct._id) {
        // Atualizar produto existente
        await ProdutoService.update(editingProduct._id, produtoData);
      } else {
        // Criar novo produto
        await ProdutoService.create(produtoData);
      }
      
      // Recarregar a lista de produtos
      await loadProducts();
      resetForm();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      setError('Erro ao salvar produto. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      valor: '',
      empresa: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: Produto) => {
    setFormData({
      nome: product.nome,
      descricao: product.descricao,
      valor: product.valor.toString(),
      empresa: typeof product.empresa === 'string' ? product.empresa : (product.empresa as Empresa)._id || ''
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        setLoading(true);
        setError('');
        await ProdutoService.delete(id);
        await loadProducts();
      } catch (err) {
        console.error('Erro ao excluir produto:', err);
        setError('Erro ao excluir produto. Verifique se o servidor está rodando.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Removida função getCompanyName que não é mais utilizada
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600 mt-2">Gerencie seus produtos</p>
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
          Novo Produto
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <Card title={editingProduct ? 'Editar Produto' : 'Novo Produto'} className="mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome do Produto"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
            <Input
              label="Valor (R$)"
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              required
            />
            <Input
              label="Descrição"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
              className="md:col-span-2"
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
                {editingProduct ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
                  <Package className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{product.nome}</h3>
                  <p className="text-sm text-gray-500">R$ {product.valor.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleEdit(product)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(product._id || '')}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm mb-4">
              <p className="text-gray-600">{product.descricao}</p>
              <p><span className="font-medium">Valor:</span> R$ {product.valor.toFixed(2)}</p>
              <p><span className="font-medium">Empresa:</span> {
                typeof product.empresa === 'string' ? 
                  companies.find(c => c._id === product.empresa)?.nomeFantasia || product.empresa : 
                  (product.empresa as Empresa).nomeFantasia
              }</p>
            </div>
          </Card>
        ))}
      </div>

      {products.length === 0 && !showForm && (
        <Card className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto cadastrado</h3>
          <p className="text-gray-500 mb-4">Comece criando seu primeiro produto</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Products;