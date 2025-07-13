# CommerceApp - Sistema de Gestão Comercial

Uma aplicação completa de gestão comercial desenvolvida em React com TypeScript, oferecendo funcionalidades abrangentes para administração de empresas, produtos, clientes e pedidos.

## 🚀 Funcionalidades

### Autenticação
- **Cadastro de usuários** com validação de email único
- **Login seguro** com autenticação por email e senha
- **Proteção de rotas** para usuários autenticados
- **Logout** com limpeza de sessão

### Gestão de Empresas
- Cadastro completo de empresas com informações fiscais
- Campos: Nome, CNPJ, Email, Telefone, Endereço completo
- Operações CRUD (Create, Read, Update, Delete)
- Interface intuitiva com cartões informativos

### Gestão de Produtos
- Cadastro de produtos com categoria e controle de estoque
- Campos: Nome, Descrição, Preço, Categoria, Estoque, Empresa
- Vinculação de produtos às empresas
- Indicadores visuais de status do estoque
- Controle automático de estoque nos pedidos

### Gestão de Clientes
- Cadastro completo de clientes com dados pessoais
- Campos: Nome, CPF, Email, Telefone, Endereço, Empresa
- Vinculação de clientes às empresas
- Interface organizada para fácil visualização

### Sistema de Pedidos
- **Criação de pedidos** com seleção de clientes e produtos
- **Carrinho de compras** com adição/remoção de itens
- **Controle de estoque** automático
- **Gestão de status** (Pendente, Processando, Enviado, Entregue, Cancelado)
- **Cálculo automático** de totais
- **Histórico completo** de pedidos

### Dashboard
- **Visão geral** com estatísticas importantes
- **Cards informativos** com métricas do negócio
- **Indicadores** de empresas, produtos, clientes e pedidos
- **Faturamento total** e pedidos pendentes
- **Status do sistema** em tempo real

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **React Router DOM** - Roteamento e navegação
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones moderna
- **Vite** - Ferramenta de build rápida

### Armazenamento
- **localStorage** - Persistência de dados no navegador
- Simulação de backend com armazenamento local

### Arquitetura
- **Context API** - Gerenciamento de estado global
- **Componentes modulares** - Reutilização e manutenibilidade
- **TypeScript interfaces** - Tipagem forte dos dados
- **Responsive design** - Compatibilidade com dispositivos móveis

## 🎨 Design e Interface

### Sistema de Cores
- **Primária**: Azul (#3B82F6) - Navegação e ações principais
- **Secundária**: Verde (#10B981) - Produtos e confirmações
- **Terciária**: Roxo (#8B5CF6) - Clientes
- **Quaternária**: Laranja (#F59E0B) - Pedidos
- **Sucesso**: Verde (#059669)
- **Erro**: Vermelho (#DC2626)
- **Aviso**: Amarelo (#D97706)

### Recursos de Design
- **Layout responsivo** para desktop, tablet e mobile
- **Sidebar colapsível** com navegação intuitiva
- **Cards modernos** com sombras sutis
- **Animações suaves** em transições e hover
- **Tipografia clara** com hierarquia bem definida
- **Feedback visual** em todas as interações

## 💾 Estrutura de Dados

### Usuário
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}
```

### Empresa
```typescript
interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
}
```

### Produto
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  companyId: string;
  createdAt: string;
}
```

### Cliente
```typescript
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  companyId: string;
  createdAt: string;
}
```

### Pedido
```typescript
interface Order {
  id: string;
  customerId: string;
  customerName: string;
  companyId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}
```

## 🔒 Segurança

### Autenticação
- Validação de email único no cadastro
- Senhas com mínimo de 6 caracteres
- Sessão persistente com localStorage
- Proteção de rotas sensíveis

### Validações
- Validação de formulários no frontend
- Verificação de estoque antes de criar pedidos
- Confirmação para ações destrutivas (exclusão)
- Tratamento de erros com feedback ao usuário

## 🔄 Fluxo de Trabalho

### 1. Configuração Inicial
1. Criar conta de usuário
2. Fazer login no sistema
3. Acessar o dashboard

### 2. Cadastro Base
1. Cadastrar empresas
2. Cadastrar produtos vinculados às empresas
3. Cadastrar clientes vinculados às empresas

### 3. Operação
1. Criar novos pedidos
2. Gerenciar status dos pedidos
3. Acompanhar métricas no dashboard

## 🆘 Solução de Problemas

### Problemas Comuns

**Dados não estão salvando**
- Verifique se o navegador permite localStorage
- Certifique-se de que não está no modo privado

**Erro ao criar pedido**
- Verifique se há produtos cadastrados
- Confirme se o estoque está disponível
- Certifique-se de que há clientes cadastrados

**Interface não responsiva**
- Atualize a página
- Verifique se o Tailwind CSS está carregando

## 🔧 Customização

### Temas
O sistema usa Tailwind CSS, permitindo fácil customização:
- Edite `tailwind.config.js` para cores personalizadas
- Modifique componentes base em `src/components/`

### Funcionalidades
- Adicione novos campos nos formulários
- Estenda as interfaces TypeScript
- Implemente novas validações

## 📈 Melhorias Futuras

- **Backend real** com API REST
- **Banco de dados** relacional
- **Relatórios** em PDF
- **Integração** com sistemas de pagamento
- **Notificações** push
- **Exportação** de dados
- **Multi-empresa** para um usuário
- **Permissões** de usuário avançadas