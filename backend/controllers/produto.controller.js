import Produto from '../models/produto.model.js';
import Empresa from '../models/empresa.model.js';
import mongoose from 'mongoose';

// Criar novo produto
export const criarProduto = async (req, res) => {
  try {
    const { nome, valor, descricao, empresa } = req.body;
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT
    
    console.log('Dados recebidos:', { nome, valor, descricao, empresa, usuarioId });
    
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

    // Verificar se a empresa existe e pertence ao usuário atual
    const empresaExistente = await Empresa.findOne({ _id: empresa, usuario: usuarioId });
    if (!empresaExistente) {
      return res.status(404).json({ message: 'Empresa não encontrada ou não pertence ao usuário atual' });
    }

    // Verificar se já existe um produto com este nome para esta empresa e usuário
    const produtoExistente = await Produto.findOne({ nome, empresa, usuario: usuarioId });
    if (produtoExistente) {
      return res.status(400).json({ message: 'Já existe um produto com este nome para esta empresa' });
    }

    // Criar novo produto associado ao usuário atual
    const novoProduto = new Produto({
      nome,
      valor,
      descricao,
      empresa,
      usuario: usuarioId
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

// Listar todos os produtos do usuário atual
export const listarProdutos = async (req, res) => {
  try {
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT
    console.log('Listando produtos para o usuário:', usuarioId);
    
    // Buscar APENAS produtos que tenham o campo usuario igual ao ID do usuário atual
    // Sem exceções - isolamento estrito de dados por usuário
    const query = { usuario: usuarioId };
    
    const produtos = await Produto.find(query).populate('empresa', 'nomeFantasia');
    
    console.log(`Encontrados ${produtos.length} produtos para o usuário ${usuarioId}`);
    res.status(200).json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ message: 'Erro ao listar produtos', error: error.message });
  }
};

// Obter produto por ID (apenas se pertencer ao usuário atual)
export const obterProduto = async (req, res) => {
  try {
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT
    const produto = await Produto.findOne({ _id: req.params.id, usuario: usuarioId })
      .populate({
        path: 'empresa',
        select: 'nomeFantasia razaoSocial cnpj',
        match: { usuario: usuarioId } // Garante que a empresa também pertence ao usuário
      });
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
  }
};

// Atualizar produto (apenas se pertencer ao usuário atual)
export const atualizarProduto = async (req, res) => {
  try {
    const { nome, valor, descricao, empresa } = req.body;
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT

    // Verificar se a empresa existe e pertence ao usuário atual
    if (empresa) {
      const empresaExistente = await Empresa.findOne({ _id: empresa, usuario: usuarioId });
      if (!empresaExistente) {
        return res.status(404).json({ message: 'Empresa não encontrada ou não pertence ao usuário atual' });
      }
    }

    // Verificar se já existe outro produto com este nome para esta empresa e usuário
    if (nome && empresa) {
      const produtoExistente = await Produto.findOne({ 
        nome, 
        empresa, 
        usuario: usuarioId, 
        _id: { $ne: req.params.id } 
      });
      if (produtoExistente) {
        return res.status(400).json({ message: 'Já existe outro produto com este nome para esta empresa' });
      }
    }

    const produtoAtualizado = await Produto.findOneAndUpdate(
      { _id: req.params.id, usuario: usuarioId },
      { nome, valor, descricao, empresa },
      { new: true, runValidators: true }
    ).populate({
      path: 'empresa',
      select: 'nomeFantasia',
      match: { usuario: usuarioId } // Garante que a empresa também pertence ao usuário
    });

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

// Excluir produto (apenas se pertencer ao usuário atual)
export const excluirProduto = async (req, res) => {
  try {
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT
    const produto = await Produto.findOneAndDelete({ _id: req.params.id, usuario: usuarioId });
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir produto', error: error.message });
  }
};
