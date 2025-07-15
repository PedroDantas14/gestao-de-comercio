import jwt from 'jsonwebtoken';

// Middleware de autenticação JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('=== AUTH MIDDLEWARE ===');
  console.log('Rota acessada:', req.originalUrl);
  console.log('Método:', req.method);
  console.log('Auth Header:', authHeader ? 'Presente' : 'Ausente');
  console.log('Token:', token ? `${token.substring(0, 10)}...` : 'Ausente');
  
  if (!token) {
    console.log('Erro: Token não fornecido');
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    // Verificar token de forma síncrona para capturar erros mais facilmente
    const user = jwt.verify(token, process.env.JWT_SECRET || 'VENDERGAS');
    
    if (!user || !user.id) {
      console.log('Erro: Token não contém ID do usuário');
      return res.status(403).json({ message: 'Token inválido ou mal formado' });
    }
    
    console.log('Token verificado com sucesso');
    console.log('Usuário autenticado:', user.id);
    
    // Garantir que req.user tenha o ID do usuário
    req.user = user;
    next();
  } catch (err) {
    console.log('Erro ao verificar token:', err.message);
    return res.status(403).json({ message: 'Token inválido', error: err.message });
  }
};
