import express from 'express';
import { 
  criarProduto, 
  listarProdutos, 
  obterProduto, 
  atualizarProduto, 
  excluirProduto 
} from '../controllers/produto.controller.js';

const router = express.Router();

// Todas as rotas já estão protegidas pelo middleware authenticateToken no server.js

// Rotas para produtos
router.post('/', criarProduto);
router.get('/', listarProdutos);
router.get('/:id', obterProduto);
router.put('/:id', atualizarProduto);
router.delete('/:id', excluirProduto);

export default router;
