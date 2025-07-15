import Cliente from '../models/cliente.model.js';
import Empresa from '../models/empresa.model.js';
import mongoose from 'mongoose';

// Criar novo cliente
export const criarCliente = async (req, res) => {
  try {
    const { nome, email, telefone, empresa } = req.body;
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT
    
    console.log('Dados recebidos:', { nome, email, telefone, empresa, usuarioId });
    
    // Validar campos obrigatórios
    if (!nome || !email || !telefone) {
      return res.status(400).json({ message: 'Nome, email e telefone são campos obrigatórios' });
    }
    
    // Verificar se o email é válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email inválido' });
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

    // Verificar se já existe um cliente com este email para este usuário
    const clienteExistente = await Cliente.findOne({ email, usuario: usuarioId });
    if (clienteExistente) {
      return res.status(400).json({ message: 'Já existe um cliente com este email para este usuário' });
    }

    // Criar novo cliente associado ao usuário atual
    const novoCliente = new Cliente({
      nome,
      email,
      telefone,
      empresa,
      usuario: usuarioId
    });

    await novoCliente.save();
    console.log('Cliente salvo com sucesso:', novoCliente);

    res.status(201).json({
      message: 'Cliente criado com sucesso',
      cliente: novoCliente
    });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
  }
};

// Listar todos os clientes do usuário atual
export const listarClientes = async (req, res) => {
  try {
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT
    console.log('Listando clientes para o usuário:', usuarioId);
    
    // Buscar APENAS clientes que tenham o campo usuario igual ao ID do usuário atual
    // Sem exceções - isolamento estrito de dados por usuário
    const query = { usuario: usuarioId };
    
    const clientes = await Cliente.find(query).populate('empresa', 'nomeFantasia');
    
    console.log(`Encontrados ${clientes.length} clientes para o usuário ${usuarioId}`);
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ message: 'Erro ao listar clientes', error: error.message });
  }
};

// Obter cliente por ID (apenas se pertencer ao usuário atual)
export const obterCliente = async (req, res) => {
  try {
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT
    const cliente = await Cliente.findOne({ _id: req.params.id, usuario: usuarioId })
      .populate({
        path: 'empresa',
        select: 'nomeFantasia razaoSocial cnpj',
        match: { usuario: usuarioId } // Garante que a empresa também pertence ao usuário
      });
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
  }
};

// Atualizar cliente (apenas se pertencer ao usuário atual)
export const atualizarCliente = async (req, res) => {
  try {
    const { nome, email, telefone, empresa } = req.body;
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT

    // Verificar se a empresa existe e pertence ao usuário atual
    if (empresa) {
      const empresaExistente = await Empresa.findOne({ _id: empresa, usuario: usuarioId });
      if (!empresaExistente) {
        return res.status(404).json({ message: 'Empresa não encontrada ou não pertence ao usuário atual' });
      }
    }

    // Verificar se já existe outro cliente com este email para este usuário
    if (email) {
      const clienteExistente = await Cliente.findOne({ 
        email, 
        usuario: usuarioId, 
        _id: { $ne: req.params.id } 
      });
      if (clienteExistente) {
        return res.status(400).json({ message: 'Já existe outro cliente com este email para este usuário' });
      }
    }

    const clienteAtualizado = await Cliente.findOneAndUpdate(
      { _id: req.params.id, usuario: usuarioId },
      { nome, email, telefone, empresa },
      { new: true, runValidators: true }
    ).populate({
      path: 'empresa',
      select: 'nomeFantasia',
      match: { usuario: usuarioId } // Garante que a empresa também pertence ao usuário
    });

    if (!clienteAtualizado) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.status(200).json({
      message: 'Cliente atualizado com sucesso',
      cliente: clienteAtualizado
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
  }
};

// Excluir cliente (apenas se pertencer ao usuário atual)
export const excluirCliente = async (req, res) => {
  try {
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT
    const cliente = await Cliente.findOneAndDelete({ _id: req.params.id, usuario: usuarioId });
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.status(200).json({ message: 'Cliente excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir cliente', error: error.message });
  }
};
