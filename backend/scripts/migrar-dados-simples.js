/**
 * Script para migrar dados existentes para o usuário teste@gmail.com
 * 
 * Para executar:
 * 1. Abra o terminal na pasta backend
 * 2. Execute: node scripts/migrar-dados-simples.js
 */

import mongoose from 'mongoose';
import Empresa from '../models/empresa.model.js';
import Cliente from '../models/cliente.model.js';
import Produto from '../models/produto.model.js';
import Pedido from '../models/pedido.model.js';
import PedidoProduto from '../models/pedidoProduto.model.js';

// Adicionar log para depuração
console.log('Script de migração iniciado...');

// ID do usuário "teste@gmail.com"
const USUARIO_ID = '687467119480b6945ab8642d';

// Conexão com MongoDB
mongoose.connect('mongodb+srv://alvesdantas144:pedro123@cluster0.aehyijm.mongodb.net/gestao-de-comercio?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log('Conectado ao MongoDB Atlas com sucesso');
    
    try {
      console.log('Iniciando migração de dados...');
      
      // Migrar empresas
      const empresas = await Empresa.find({ $or: [{ usuario: { $exists: false } }, { usuario: null }] });
      console.log(`Encontradas ${empresas.length} empresas sem usuário associado`);
      
      for (const empresa of empresas) {
        await Empresa.updateOne(
          { _id: empresa._id },
          { $set: { usuario: USUARIO_ID } }
        );
      }
      console.log(`${empresas.length} empresas atualizadas com sucesso`);
      
      // Migrar clientes
      const clientes = await Cliente.find({ $or: [{ usuario: { $exists: false } }, { usuario: null }] });
      console.log(`Encontrados ${clientes.length} clientes sem usuário associado`);
      
      for (const cliente of clientes) {
        await Cliente.updateOne(
          { _id: cliente._id },
          { $set: { usuario: USUARIO_ID } }
        );
      }
      console.log(`${clientes.length} clientes atualizados com sucesso`);
      
      // Migrar produtos
      const produtos = await Produto.find({ $or: [{ usuario: { $exists: false } }, { usuario: null }] });
      console.log(`Encontrados ${produtos.length} produtos sem usuário associado`);
      
      for (const produto of produtos) {
        await Produto.updateOne(
          { _id: produto._id },
          { $set: { usuario: USUARIO_ID } }
        );
      }
      console.log(`${produtos.length} produtos atualizados com sucesso`);
      
      // Migrar pedidos
      const pedidos = await Pedido.find({ $or: [{ usuario: { $exists: false } }, { usuario: null }] });
      console.log(`Encontrados ${pedidos.length} pedidos sem usuário associado`);
      
      for (const pedido of pedidos) {
        await Pedido.updateOne(
          { _id: pedido._id },
          { $set: { usuario: USUARIO_ID } }
        );
      }
      console.log(`${pedidos.length} pedidos atualizados com sucesso`);
      
      // Migrar itens de pedido
      const itensPedido = await PedidoProduto.find({ $or: [{ usuario: { $exists: false } }, { usuario: null }] });
      console.log(`Encontrados ${itensPedido.length} itens de pedido sem usuário associado`);
      
      for (const item of itensPedido) {
        await PedidoProduto.updateOne(
          { _id: item._id },
          { $set: { usuario: USUARIO_ID } }
        );
      }
      console.log(`${itensPedido.length} itens de pedido atualizados com sucesso`);
      
      console.log('Migração de dados concluída com sucesso!');
    } catch (error) {
      console.error('Erro durante a migração de dados:', error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(error => {
    console.error('Erro ao conectar com o MongoDB:', error);
  });
