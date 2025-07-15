import Empresa from '../models/empresa.model.js';

// Criar nova empresa
export const criarEmpresa = async (req, res) => {
  try {
    const { nomeFantasia, razaoSocial, cnpj } = req.body;

    // Verificar se já existe empresa com este CNPJ
    const empresaExistente = await Empresa.findOne({ cnpj });
    if (empresaExistente) {
      return res.status(400).json({ message: 'Já existe uma empresa com este CNPJ' });
    }

    // Criar nova empresa
    const novaEmpresa = new Empresa({
      nomeFantasia,
      razaoSocial,
      cnpj
    });

    await novaEmpresa.save();

    res.status(201).json({
      message: 'Empresa criada com sucesso',
      empresa: novaEmpresa
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar empresa', error: error.message });
  }
};

// Listar todas as empresas
export const listarEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.find();
    res.status(200).json(empresas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar empresas', error: error.message });
  }
};

// Obter empresa por ID
export const obterEmpresa = async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    res.status(200).json(empresa);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar empresa', error: error.message });
  }
};

// Atualizar empresa
export const atualizarEmpresa = async (req, res) => {
  try {
    const { nomeFantasia, razaoSocial, cnpj } = req.body;

    // Verificar se existe outra empresa com o mesmo CNPJ
    if (cnpj) {
      const empresaExistente = await Empresa.findOne({ cnpj, _id: { $ne: req.params.id } });
      if (empresaExistente) {
        return res.status(400).json({ message: 'Já existe outra empresa com este CNPJ' });
      }
    }

    const empresaAtualizada = await Empresa.findByIdAndUpdate(
      req.params.id,
      { nomeFantasia, razaoSocial, cnpj },
      { new: true, runValidators: true }
    );

    if (!empresaAtualizada) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    res.status(200).json({
      message: 'Empresa atualizada com sucesso',
      empresa: empresaAtualizada
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar empresa', error: error.message });
  }
};

// Excluir empresa
export const excluirEmpresa = async (req, res) => {
  try {
    const empresa = await Empresa.findByIdAndDelete(req.params.id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    res.status(200).json({ message: 'Empresa excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir empresa', error: error.message });
  }
};
