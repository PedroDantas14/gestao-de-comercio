# Gestão de Comércio - Sistema Completo

Um sistema completo de gestão comercial com arquitetura moderna, dividido em frontend (React/TypeScript) e backend (Node.js/Express), oferecendo funcionalidades abrangentes para administração de empresas, produtos, clientes e pedidos.

## 🚀 Funcionalidades

### Autenticação
- **Cadastro de usuários** com validação de email único
- **Login seguro** com autenticação JWT
- **Proteção de rotas** para usuários autenticados
- **Logout** com limpeza de sessão

### Gestão de Empresas
- Cadastro completo de empresas com informações fiscais
- Campos: Nome, CNPJ, Email, Telefone, Endereço completo
- Operações CRUD completas via API
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
- **React Router DOM 7** - Roteamento e navegação
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones moderna
- **Vite** - Ferramenta de build rápida
- **Axios** - Cliente HTTP para comunicação com a API

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web para Node.js
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação baseada em tokens
- **bcryptjs** - Criptografia de senhas
- **CORS** - Configuração de políticas de origem cruzada

### Arquitetura
- **API RESTful** - Comunicação padronizada entre frontend e backend
- **MVC** - Padrão de arquitetura no backend
- **Context API** - Gerenciamento de estado global no frontend
- **Componentes modulares** - Reutilização e manutenibilidade
- **TypeScript interfaces** - Tipagem forte dos dados
- **Responsive design** - Compatibilidade com dispositivos móveis

## 🏗️ Estrutura do Projeto

### Frontend (`/frontend`)
```
frontend/
├── public/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── contexts/        # Contextos para gerenciamento de estado
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Serviços de comunicação com a API
│   ├── types/           # Definições de tipos TypeScript
│   ├── utils/           # Funções utilitárias
│   ├── App.tsx          # Componente principal
│   ├── Layout.tsx       # Layout com rotas aninhadas
│   └── main.tsx         # Ponto de entrada
└── package.json         # Dependências e scripts
```

### Backend (`/backend`)
```
backend/
├── controllers/         # Controladores da aplicação
├── models/              # Modelos do Mongoose
├── routes/              # Rotas da API
├── middlewares/         # Middlewares (autenticação, etc)
├── config/              # Configurações
├── server.js            # Servidor Express
└── package.json         # Dependências e scripts
```

## 🔌 Integração Frontend-Backend

### Serviços de API
- **auth.service.ts**: autenticação (login, registro, logout)
- **empresa.service.ts**: CRUD para empresas
- **cliente.service.ts**: CRUD para clientes
- **produto.service.ts**: CRUD para produtos
- **pedido.service.ts**: CRUD para pedidos

### Implementação da Autenticação
- Token JWT armazenado no localStorage
- Interceptor Axios para incluir token nas requisições
- Middleware de autenticação no backend
- Componente ProtectedRoute para rotas privadas

## 🔒 Segurança

### Mecanismos de Segurança
- Senhas criptografadas com bcrypt
- Tokens JWT com expiração
- Validação de dados no backend
- Proteção contra CSRF e XSS

### Validações
- Validação de formulários no frontend
- Validação de dados no backend
- Verificação de estoque antes de criar pedidos
- Confirmação para ações destrutivas (exclusão)
- Tratamento de erros com feedback ao usuário

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v14+)
- MongoDB (local ou Atlas)
- XAMPP ou outro servidor web local

### Backend
1. Navegue até a pasta `backend`
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente (copie `.env.example` para `.env`)
4. Inicie o servidor: `npm run dev`
5. O servidor estará disponível em `http://localhost:3000`

### Frontend
1. Navegue até a pasta `frontend`
2. Instale as dependências: `npm install`
3. Inicie o servidor de desenvolvimento: `npm run dev`
4. Acesse a aplicação em `http://localhost:5174`

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

**API não responde**
- Verifique se o servidor backend está rodando
- Confirme as configurações de CORS
- Verifique se o MongoDB está acessível

**Erro de autenticação**
- Verifique se o token JWT está sendo enviado corretamente
- Confirme se o token não expirou
- Tente fazer logout e login novamente

**Erro ao criar pedido**
- Verifique se há produtos cadastrados
- Confirme se o estoque está disponível
- Certifique-se de que há clientes cadastrados

## 📈 Próximos Passos

- **Relatórios** em PDF
- **Integração** com sistemas de pagamento
- **Notificações** em tempo real
- **Exportação** de dados em CSV/Excel
- **Multi-empresa** para um usuário
- **Permissões** de usuário avançadas
- **Testes automatizados** para frontend e backend
- **CI/CD** para implantação contínua