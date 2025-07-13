import Cliente from '../models/cliente.model.js';
import Empresa from '../models/empresa.model.js';

// Criar novo cliente
export const criarCliente = async (req, res) => {
  try {
    const { nome, email, telefone, empresa } = req.body;

    // Verificar se a empresa existe
    const empresaExistente = await Empresa.findById(empresa);
    if (!empresaExistente) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    // Criar novo cliente
    const novoCliente = new Cliente({
      nome,
      email,
      telefone,
      empresa
    });

    await novoCliente.save();

    res.status(201).json({
      message: 'Cliente criado com sucesso',
      cliente: novoCliente
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
  }
};

// Listar todos os clientes
export const listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().populate('empresa', 'nomeFantasia');
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar clientes', error: error.message });
  }
};

// Obter cliente por ID
export const obterCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id).populate('empresa', 'nomeFantasia razaoSocial cnpj');
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
  }
};

// Atualizar cliente
export const atualizarCliente = async (req, res) => {
  try {
    const { nome, email, telefone, empresa } = req.body;

    // Verificar se a empresa existe
    if (empresa) {
      const empresaExistente = await Empresa.findById(empresa);
      if (!empresaExistente) {
        return res.status(404).json({ message: 'Empresa não encontrada' });
      }
    }

    const clienteAtualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      { nome, email, telefone, empresa },
      { new: true, runValidators: true }
    ).populate('empresa', 'nomeFantasia');

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

// Excluir cliente
export const excluirCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.status(200).json({ message: 'Cliente excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir cliente', error: error.message });
  }
};
