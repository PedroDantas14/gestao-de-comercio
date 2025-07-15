import express from 'express';
import { 
  criarCliente, 
  listarClientes, 
  obterCliente, 
  atualizarCliente, 
  excluirCliente 
} from '../controllers/cliente.controller.js';

const router = express.Router();

// Todas as rotas já estão protegidas pelo middleware authenticateToken no server.js

// Rotas para clientes
router.post('/', criarCliente);
router.get('/', listarClientes);
router.get('/:id', obterCliente);
router.put('/:id', atualizarCliente);
router.delete('/:id', excluirCliente);

export default router;
