import Usuario from '../models/usuario.model.js';
import jwt from 'jsonwebtoken';

// Registrar novo usuário
export const registrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verificar se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Criar novo usuário
    const novoUsuario = new Usuario({
      nome,
      email,
      senha
    });

    await novoUsuario.save();

    // Gerar token JWT
    const token = jwt.sign(
      { id: novoUsuario._id, email: novoUsuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token,
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
};

// Login de usuário
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se o usuário existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaCorreta = await usuario.verificarSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};

// Obter perfil do usuário
export const getPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id).select('-senha');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar perfil', error: error.message });
  }
};
