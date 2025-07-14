import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";

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
    // Usando a variável de ambiente MONGO_URI
    const mongoURI = 'mongodb+srv://alvesdantas144:pedro123@cluster0.aehyijm.mongodb.net/gestao-de-comercio?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoURI);
    console.log("Conectado ao MongoDB Atlas com sucesso");
  } catch (error) {
    console.log("Erro ao conectar com o MongoDB:", error);
  }
};

// Iniciar conexão com o MongoDB
connectDB();

// Middleware de autenticação JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  // Usando a chave JWT_SECRET definida como VENDERGAS no .env
  jwt.verify(token, process.env.JWT_SECRET || 'VENDERGAS', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

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
