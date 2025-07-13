import express from 'express';
import { 
  criarEmpresa, 
  listarEmpresas, 
  obterEmpresa, 
  atualizarEmpresa, 
  excluirEmpresa 
} from '../controllers/empresa.controller.js';

const router = express.Router();

// Todas as rotas já estão protegidas pelo middleware authenticateToken no server.js

// Rotas para empresas
router.post('/', criarEmpresa);
router.get('/', listarEmpresas);
router.get('/:id', obterEmpresa);
router.put('/:id', atualizarEmpresa);
router.delete('/:id', excluirEmpresa);

export default router;
