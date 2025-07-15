import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
// Importar o middleware de autenticação
import { authenticateToken } from './middlewares/auth.middleware.js';

// Importação das rotas
import usuarioRoutes from './routes/usuario.routes.js';
import empresaRoutes from './routes/empresa.routes.js';
import clienteRoutes from './routes/cliente.routes.js';
import produtoRoutes from './routes/produto.routes.js';
import pedidoRoutes from './routes/pedido.routes.js';

// Carrega variáveis de ambiente
dotenv.config();

// Configuração do servidor Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão com MongoDB
const connectDB = async () => {
  try {
    // Usando a variável de ambiente MONGO_URI ou o valor hardcoded como fallback
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://alvesdantas144:pedro123@cluster0.aehyijm.mongodb.net/gestao-de-comercio?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Conectado ao MongoDB Atlas com sucesso");
  } catch (error) {
    console.error("Erro ao conectar com o MongoDB:", error);
    process.exit(1); // Encerra o processo se não conseguir conectar ao banco de dados
  }
};

// Iniciar conexão com o MongoDB
connectDB();

// O middleware de autenticação JWT foi movido para ./middlewares/auth.middleware.js

// Rota de teste
app.get("/", (req, res) => {
  res.json({ message: "API de Gestão de Comércio" });
});

// Usar rotas
app.use("/api/auth", usuarioRoutes);
app.use("/api/empresas", authenticateToken, empresaRoutes);
app.use("/api/clientes", authenticateToken, clienteRoutes);
app.use("/api/produtos", authenticateToken, produtoRoutes);
app.use("/api/pedidos", authenticateToken, pedidoRoutes);

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
