import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Empresa from '../models/empresa.model.js';
import Cliente from '../models/cliente.model.js';
import Produto from '../models/produto.model.js';
import Pedido from '../models/pedido.model.js';
import Usuario from '../models/usuario.model.js';

// Carrega variáveis de ambiente
dotenv.config();

// Função para conectar ao MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://alvesdantas144:pedro123@cluster0.aehyijm.mongodb.net/gestao-de-comercio?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Conectado ao MongoDB Atlas com sucesso");
  } catch (error) {
    console.error("Erro ao conectar com o MongoDB:", error);
    process.exit(1);
  }
};

// Função principal para migrar os dados
const migrarDados = async () => {
  try {
    // Conectar ao banco de dados
    await connectDB();

    // Buscar o primeiro usuário (ou criar um se não existir)
    let usuario = await Usuario.findOne();
    
    if (!usuario) {
      console.log('Nenhum usuário encontrado. Criando um usuário padrão...');
      usuario = new Usuario({
        nome: 'Usuário Padrão',
        email: 'padrao@exemplo.com',
        senha: 'senha123'
      });
      await usuario.save();
      console.log('Usuário padrão criado com ID:', usuario._id);
    } else {
      console.log('Usuário encontrado com ID:', usuario._id);
    }

    // Atualizar todas as empresas
    const empresasAtualizadas = await Empresa.updateMany(
      { usuario: { $exists: false } },
      { $set: { usuario: usuario._id } }
    );
    console.log(`${empresasAtualizadas.modifiedCount} empresas atualizadas`);

    // Atualizar todos os clientes
    const clientesAtualizados = await Cliente.updateMany(
      { usuario: { $exists: false } },
      { $set: { usuario: usuario._id } }
    );
    console.log(`${clientesAtualizados.modifiedCount} clientes atualizados`);

    // Atualizar todos os produtos
    const produtosAtualizados = await Produto.updateMany(
      { usuario: { $exists: false } },
      { $set: { usuario: usuario._id } }
    );
    console.log(`${produtosAtualizados.modifiedCount} produtos atualizados`);

    // Atualizar todos os pedidos
    const pedidosAtualizados = await Pedido.updateMany(
      { usuario: { $exists: false } },
      { $set: { usuario: usuario._id } }
    );
    console.log(`${pedidosAtualizados.modifiedCount} pedidos atualizados`);

    console.log('Migração concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro durante a migração:', error);
    process.exit(1);
  }
};

// Executar a migração
migrarDados();
