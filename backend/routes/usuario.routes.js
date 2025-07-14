import express from 'express';
import { registrar, login, getPerfil } from '../controllers/usuario.controller.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware de autenticação JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'VENDERGAS', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rotas públicas
router.post('/registrar', registrar);
router.post('/login', login);

// Rotas protegidas
router.get('/perfil', authenticateToken, getPerfil);

export default router;
