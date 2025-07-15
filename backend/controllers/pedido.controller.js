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
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT

    // Verificar se o cliente existe e pertence ao usuário atual
    const clienteExistente = await Cliente.findOne({ _id: cliente, usuario: usuarioId });
    if (!clienteExistente) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Cliente não encontrado ou não pertence ao usuário atual' });
    }

    // Verificar se a empresa existe e pertence ao usuário atual
    const empresaExistente = await Empresa.findOne({ _id: empresa, usuario: usuarioId });
    if (!empresaExistente) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Empresa não encontrada ou não pertence ao usuário atual' });
    }

    // Verificar se já existe pedido com este número para este usuário
    const pedidoExistente = await Pedido.findOne({ numero, usuario: usuarioId });
    if (pedidoExistente) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Já existe um pedido com este número para este usuário' });
    }

    // Criar novo pedido associado ao usuário atual
    const novoPedido = new Pedido({
      numero,
      cliente,
      empresa,
      observacao,
      data: new Date(),
      usuario: usuarioId
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
    let valorTotal = 0;
    
    for (const item of produtos) {
      // Verificar se o produto existe e pertence ao usuário atual
      const produtoExistente = await Produto.findOne({ _id: item.produto, usuario: usuarioId });
      if (!produtoExistente) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: `Produto com ID ${item.produto} não encontrado ou não pertence ao usuário atual` });
      }
      
      // Obter o valor do produto
      const valorUnitario = produtoExistente.valor || 0;
      const subtotal = valorUnitario * item.quantidade;
      valorTotal += subtotal;
      
      const pedidoProduto = new PedidoProduto({
        pedido: pedidoSalvo._id,
        produto: item.produto,
        quantidade: item.quantidade,
        valorUnitario: valorUnitario,
        usuario: usuarioId // Associar o item do pedido ao usuário atual
      });

      await pedidoProduto.save({ session });
      pedidoProdutos.push(pedidoProduto);
    }
    
    // Atualizar o valor total do pedido
    pedidoSalvo.valorTotal = valorTotal;
    await pedidoSalvo.save({ session });

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

// Listar todos os pedidos do usuário atual
export const listarPedidos = async (req, res) => {
  try {
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT
    console.log('Listando pedidos para o usuário:', usuarioId);
    
    // Buscar APENAS pedidos que tenham o campo usuario igual ao ID do usuário atual
    // Sem exceções - isolamento estrito de dados por usuário
    const query = { usuario: usuarioId };
    
    // Buscar todos os pedidos do usuário atual com seus dados básicos
    const pedidos = await Pedido.find(query)
      .populate({
        path: 'cliente',
        select: 'nome email',
        match: { usuario: usuarioId } // Garante que o cliente também pertence ao usuário
      })
      .populate({
        path: 'empresa',
        select: 'nomeFantasia',
        match: { usuario: usuarioId } // Garante que a empresa também pertence ao usuário
      })
      .sort({ data: -1 });
    
    // Para cada pedido, buscar seus produtos
    const pedidosCompletos = await Promise.all(pedidos.map(async (pedido) => {
      // Buscar os produtos do pedido com a mesma lógica de isolamento de dados
      let itemQuery;
      
      if (usuarioId === '687467119480b6945ab8642d') {
        // Para o usuário teste@gmail.com, mostrar itens associados a ele E itens sem usuário
        itemQuery = {
          pedido: pedido._id,
          $or: [
            { usuario: usuarioId },
            { usuario: { $exists: false } },
            { usuario: null }
          ]
        };
      } else {
        // Para outros usuários, mostrar apenas itens explicitamente associados a eles
        itemQuery = { pedido: pedido._id, usuario: usuarioId };
      }
      
      const pedidoProdutos = await PedidoProduto.find(itemQuery)
        .populate({
          path: 'produto',
          select: 'nome valor descricao'
          // Removido o match para permitir que produtos sem campo usuario sejam exibidos para o usuário teste@gmail.com
        });
      
      // Converter o documento Mongoose para um objeto simples
      const pedidoObj = pedido.toObject();
      
      // Adicionar os produtos ao pedido
      pedidoObj.produtos = pedidoProdutos;
      
      return pedidoObj;
    }));
    
    res.status(200).json(pedidosCompletos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar pedidos', error: error.message });
  }
};

// Obter pedido por ID com seus produtos (apenas se pertencer ao usuário atual)
export const obterPedido = async (req, res) => {
  try {
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT
    console.log('Obtendo pedido ID:', req.params.id, 'para o usuário:', usuarioId);
    
    // Buscar APENAS pedido que tenha o ID especificado e que pertence ao usuário atual
    // Sem exceções - isolamento estrito de dados por usuário
    const query = { _id: req.params.id, usuario: usuarioId };
    
    const pedido = await Pedido.findOne(query)
      .populate({
        path: 'cliente',
        select: 'nome email telefone',
        match: { usuario: usuarioId } // Garante que o cliente também pertence ao usuário
      })
      .populate({
        path: 'empresa',
        select: 'nomeFantasia razaoSocial',
        match: { usuario: usuarioId } // Garante que a empresa também pertence ao usuário
      });

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    // Buscar APENAS os produtos do pedido que pertencem ao usuário atual
    // Sem exceções - isolamento estrito de dados por usuário
    const itemQuery = { pedido: pedido._id, usuario: usuarioId };
    
    const pedidoProdutos = await PedidoProduto.find(itemQuery)
      .populate({
        path: 'produto',
        select: 'nome valor descricao',
        match: { usuario: usuarioId } // Garante que o produto também pertence ao usuário
      });

    // Converter o documento Mongoose para um objeto simples
    const pedidoObj = pedido.toObject();
    
    // Adicionar os produtos ao pedido
    pedidoObj.produtos = pedidoProdutos;

    res.status(200).json(pedidoObj);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedido', error: error.message });
  }
};

// Atualizar pedido (apenas se pertencer ao usuário atual)
export const atualizarPedido = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { observacao } = req.body;
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT
    console.log('Atualizando pedido ID:', req.params.id, 'para o usuário:', usuarioId);
    
    // Buscar APENAS pedido que tenha o ID especificado e que pertence ao usuário atual
    // Sem exceções - isolamento estrito de dados por usuário
    const query = { _id: req.params.id, usuario: usuarioId };

    // Atualizar apenas a observação do pedido
    const pedidoAtualizado = await Pedido.findOneAndUpdate(
      query,
      { 
        observacao,
        // Garantir que o pedido tenha o campo usuario definido
        usuario: usuarioId 
      },
      { new: true, runValidators: true, session }
    )
      .populate({
        path: 'cliente',
        select: 'nome email telefone',
        match: { usuario: usuarioId } // Garantir que o cliente também pertence ao usuário
      })
      .populate({
        path: 'empresa',
        select: 'nomeFantasia razaoSocial',
        match: { usuario: usuarioId } // Garantir que a empresa também pertence ao usuário
      });

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

// Excluir pedido e seus itens (apenas se pertencer ao usuário atual)
export const excluirPedido = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT
    console.log('Excluindo pedido ID:', req.params.id, 'para o usuário:', usuarioId);
    
    // Buscar APENAS pedido que tenha o ID especificado e que pertence ao usuário atual
    // Sem exceções - isolamento estrito de dados por usuário
    const query = { _id: req.params.id, usuario: usuarioId };
    
    // Excluir o pedido
    const pedido = await Pedido.findOneAndDelete(query, { session });
    if (!pedido) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    // Excluir APENAS os itens do pedido que pertencem ao usuário atual
    // Sem exceções - isolamento estrito de dados por usuário
    const itemQuery = { pedido: req.params.id, usuario: usuarioId };
    
    // Excluir os itens do pedido
    const resultado = await PedidoProduto.deleteMany(itemQuery, { session });
    console.log(`Excluídos ${resultado.deletedCount} itens do pedido ${req.params.id}`);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Pedido excluído com sucesso' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Erro ao excluir pedido', error: error.message });
  }
};
