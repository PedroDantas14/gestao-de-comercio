// Tipos baseados exatamente no diagrama apresentado

export interface Usuario {
  nome: string;
  email: string;
  senha: string; // hash
}

export interface Empresa {
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
}

export interface Cliente {
  nome: string;
  email: string;
  telefone: string;
  empresa: string; // Referência à empresa
}

export interface Produto {
  nome: string;
  valor: number;
  descricao: string;
  empresa: string; // Referência à empresa
}

export interface PedidoProduto {
  pedido: string; // Referência ao pedido
  produto: string; // Referência ao produto
  quantidade: number;
}

export interface Pedido {
  numero: string;
  cliente: string; // Referência ao cliente
  empresa: string; // Referência à empresa
  observacao: string;
  data: string;
}

// Interface para o contexto de autenticação
export interface AuthContextType {
  currentUser: Usuario | null;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => void;
}