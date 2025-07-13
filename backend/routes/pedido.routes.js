import express from 'express';
import { 
  criarPedido, 
  listarPedidos, 
  obterPedido, 
  atualizarPedido, 
  excluirPedido 
} from '../controllers/pedido.controller.js';

const router = express.Router();

// Todas as rotas já estão protegidas pelo middleware authenticateToken no server.js

// Rotas para pedidos
router.post('/', criarPedido);
router.get('/', listarPedidos);
router.get('/:id', obterPedido);
router.put('/:id', atualizarPedido);
router.delete('/:id', excluirPedido);

export default router;
