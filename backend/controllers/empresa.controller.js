import Empresa from '../models/empresa.model.js';

// Criar nova empresa
export const criarEmpresa = async (req, res) => {
  try {
    const { nomeFantasia, razaoSocial, cnpj } = req.body;
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT

    // Verificar se já existe empresa com este CNPJ para este usuário
    const empresaExistente = await Empresa.findOne({ cnpj, usuario: usuarioId });
    if (empresaExistente) {
      return res.status(400).json({ message: 'Já existe uma empresa com este CNPJ para este usuário' });
    }

    // Criar nova empresa associada ao usuário atual
    const novaEmpresa = new Empresa({
      nomeFantasia,
      razaoSocial,
      cnpj,
      usuario: usuarioId
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

// Listar todas as empresas do usuário atual
export const listarEmpresas = async (req, res) => {
  try {
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT
    console.log('Listando empresas para o usuário:', usuarioId);
    
    // Buscar APENAS empresas que tenham o campo usuario igual ao ID do usuário atual
    // Sem exceções - isolamento estrito de dados por usuário
    const query = { usuario: usuarioId };
    
    const empresas = await Empresa.find(query);
    
    console.log(`Encontradas ${empresas.length} empresas para o usuário ${usuarioId}`);
    res.status(200).json(empresas);
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ message: 'Erro ao listar empresas', error: error.message });
  }
};

// Obter empresa por ID (apenas se pertencer ao usuário atual)
export const obterEmpresa = async (req, res) => {
  try {
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT
    const empresa = await Empresa.findOne({ _id: req.params.id, usuario: usuarioId });
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    res.status(200).json(empresa);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar empresa', error: error.message });
  }
};

// Atualizar empresa (apenas se pertencer ao usuário atual)
export const atualizarEmpresa = async (req, res) => {
  try {
    const { nomeFantasia, razaoSocial, cnpj } = req.body;
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT

    // Verificar se existe outra empresa com o mesmo CNPJ para este usuário
    if (cnpj) {
      const empresaExistente = await Empresa.findOne({ 
        cnpj, 
        usuario: usuarioId, 
        _id: { $ne: req.params.id } 
      });
      if (empresaExistente) {
        return res.status(400).json({ message: 'Já existe outra empresa com este CNPJ para este usuário' });
      }
    }

    const empresaAtualizada = await Empresa.findOneAndUpdate(
      { _id: req.params.id, usuario: usuarioId },
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

// Excluir empresa (apenas se pertencer ao usuário atual)
export const excluirEmpresa = async (req, res) => {
  try {
    const usuarioId = req.user.id; // Obtém o ID do usuário do token JWT
    const empresa = await Empresa.findOneAndDelete({ _id: req.params.id, usuario: usuarioId });
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    res.status(200).json({ message: 'Empresa excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir empresa', error: error.message });
  }
};
