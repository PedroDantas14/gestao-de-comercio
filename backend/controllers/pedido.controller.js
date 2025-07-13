import Pedido from '../models/pedido.model.js';
import PedidoProduto from '../models/pedidoProduto.model.js';
import Cliente from '../models/cliente.model.js';
import Empresa from '../models/empresa.model.js';
import Produto from '../models/produto.model.js';
import mongoose from 'mongoose';

// Criar novo pedido com produtos
export const criarPedido = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { numero, cliente, empresa, observacao, produtos } = req.body;

    // Verificar se o cliente existe
    const clienteExistente = await Cliente.findById(cliente);
    if (!clienteExistente) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Verificar se a empresa existe
    const empresaExistente = await Empresa.findById(empresa);
    if (!empresaExistente) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    // Verificar se já existe pedido com este número
    const pedidoExistente = await Pedido.findOne({ numero });
    if (pedidoExistente) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Já existe um pedido com este número' });
    }

    // Criar novo pedido
    const novoPedido = new Pedido({
      numero,
      cliente,
      empresa,
      observacao,
      data: new Date()
    });

    const pedidoSalvo = await novoPedido.save({ session });

    // Verificar se há produtos no pedido
    if (!produtos || produtos.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'O pedido deve conter pelo menos um produto' });
    }

    // Adicionar produtos ao pedido
    const pedidoProdutos = [];
    for (const item of produtos) {
      // Verificar se o produto existe
      const produtoExistente = await Produto.findById(item.produto);
      if (!produtoExistente) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: `Produto com ID ${item.produto} não encontrado` });
      }

      const pedidoProduto = new PedidoProduto({
        pedido: pedidoSalvo._id,
        produto: item.produto,
        quantidade: item.quantidade
      });

      await pedidoProduto.save({ session });
      pedidoProdutos.push(pedidoProduto);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Pedido criado com sucesso',
      pedido: pedidoSalvo,
      itens: pedidoProdutos
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
  }
};

// Listar todos os pedidos
export const listarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('cliente', 'nome email')
      .populate('empresa', 'nomeFantasia')
      .sort({ data: -1 });
    
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar pedidos', error: error.message });
  }
};

// Obter pedido por ID com seus produtos
export const obterPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('cliente', 'nome email telefone')
      .populate('empresa', 'nomeFantasia razaoSocial');
    
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    // Buscar os produtos do pedido
    const pedidoProdutos = await PedidoProduto.find({ pedido: pedido._id })
      .populate('produto', 'nome valor descricao');

    res.status(200).json({
      pedido,
      itens: pedidoProdutos
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedido', error: error.message });
  }
};

// Atualizar pedido
export const atualizarPedido = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { observacao } = req.body;

    // Atualizar apenas a observação do pedido
    const pedidoAtualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      { observacao },
      { new: true, runValidators: true, session }
    )
      .populate('cliente', 'nome email')
      .populate('empresa', 'nomeFantasia');

    if (!pedidoAtualizado) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: 'Pedido atualizado com sucesso',
      pedido: pedidoAtualizado
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Erro ao atualizar pedido', error: error.message });
  }
};

// Excluir pedido e seus itens
export const excluirPedido = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Excluir o pedido
    const pedido = await Pedido.findByIdAndDelete(req.params.id, { session });
    if (!pedido) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    // Excluir os itens do pedido
    await PedidoProduto.deleteMany({ pedido: req.params.id }, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Pedido excluído com sucesso' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Erro ao excluir pedido', error: error.message });
  }
};
