// Tipos baseados no backend MongoDB

export interface BaseModel {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Usuario extends BaseModel {
  nome: string;
  email: string;
  senha?: string; // hash - opcional para não exigir no frontend
}

export interface Empresa extends BaseModel {
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
}

export interface Cliente extends BaseModel {
  nome: string;
  email: string;
  telefone: string;
  empresa: string | Empresa; // Referência à empresa - pode ser string (ID) ou objeto completo
}

export interface Produto extends BaseModel {
  nome: string;
  valor: number;
  descricao: string;
  empresa: string | Empresa; // Referência à empresa - pode ser string (ID) ou objeto completo
}

export interface PedidoProduto extends BaseModel {
  pedido: string | Pedido; // Referência ao pedido - pode ser string (ID) ou objeto completo
  produto: string | Produto; // Referência ao produto - pode ser string (ID) ou objeto completo
  quantidade: number;
  valorUnitario?: number; // Valor unitário do produto no momento da venda
}

export interface Pedido extends BaseModel {
  numero: string;
  cliente: string | Cliente; // Referência ao cliente - pode ser string (ID) ou objeto completo
  empresa: string | Empresa; // Referência à empresa - pode ser string (ID) ou objeto completo
  observacao: string;
  data: string;
  valorTotal?: number; // Valor total do pedido
  produtos?: PedidoProduto[]; // Lista de produtos do pedido
}

// Interface para o contexto de autenticação
export interface AuthContextType {
  currentUser: Usuario | null;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean; // Indica se está carregando a autenticação
}