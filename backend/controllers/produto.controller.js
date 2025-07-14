import Produto from '../models/produto.model.js';
import Empresa from '../models/empresa.model.js';
import mongoose from 'mongoose';

// Criar novo produto
export const criarProduto = async (req, res) => {
  try {
    const { nome, valor, descricao, empresa } = req.body;
    
    console.log('Dados recebidos:', { nome, valor, descricao, empresa });
    
    // Validar campos obrigatórios
    if (!nome || !descricao || valor === undefined) {
      return res.status(400).json({ message: 'Nome, descrição e valor são campos obrigatórios' });
    }
    
    // Verificar se a empresa foi fornecida
    if (!empresa) {
      return res.status(400).json({ message: 'ID da empresa é obrigatório' });
    }
    
    // Verificar se o ID da empresa é válido
    if (!mongoose.Types.ObjectId.isValid(empresa)) {
      return res.status(400).json({ message: 'ID da empresa inválido' });
    }

    // Verificar se a empresa existe
    const empresaExistente = await Empresa.findById(empresa);
    if (!empresaExistente) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    // Criar novo produto
    const novoProduto = new Produto({
      nome,
      valor,
      descricao,
      empresa
    });

    await novoProduto.save();
    console.log('Produto salvo com sucesso:', novoProduto);

    res.status(201).json({
      message: 'Produto criado com sucesso',
      produto: novoProduto
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
  }
};

// Listar todos os produtos
export const listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find().populate('empresa', 'nomeFantasia');
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar produtos', error: error.message });
  }
};

// Obter produto por ID
export const obterProduto = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id).populate('empresa', 'nomeFantasia razaoSocial cnpj');
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
  }
};

// Atualizar produto
export const atualizarProduto = async (req, res) => {
  try {
    const { nome, valor, descricao, empresa } = req.body;

    // Verificar se a empresa existe
    if (empresa) {
      const empresaExistente = await Empresa.findById(empresa);
      if (!empresaExistente) {
        return res.status(404).json({ message: 'Empresa não encontrada' });
      }
    }

    const produtoAtualizado = await Produto.findByIdAndUpdate(
      req.params.id,
      { nome, valor, descricao, empresa },
      { new: true, runValidators: true }
    ).populate('empresa', 'nomeFantasia');

    if (!produtoAtualizado) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.status(200).json({
      message: 'Produto atualizado com sucesso',
      produto: produtoAtualizado
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
  }
};

// Excluir produto
export const excluirProduto = async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir produto', error: error.message });
  }
};
