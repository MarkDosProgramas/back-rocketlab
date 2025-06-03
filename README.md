# 🛍️ Rocketlab Store API

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

API completa para e-commerce com autenticação, autorização e gerenciamento de produtos e carrinho.

</div>

## 📑 Índice

- [🌟 Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias](#️-tecnologias)
- [🚀 Começando](#-começando)
- [👥 Dados Pré-cadastrados](#-dados-pré-cadastrados)
- [🔑 Autenticação](#-autenticação)
- [📦 Endpoints](#-endpoints)
- [🔒 Níveis de Acesso](#-níveis-de-acesso)
- [💡 Exemplos](#-exemplos)

## 🌟 Funcionalidades

### 🛒 Carrinho de Compras

- Carrinho individual por usuário
- Adição/remoção de produtos
- Atualização de quantidades
- Checkout completo
- Cálculo automático de totais

### 📦 Produtos

- CRUD completo de produtos
- Categorização
- Controle de estoque
- Validações automáticas

### 👥 Usuários

- Registro e autenticação
- Perfis de usuário e admin
- JWT para segurança
- Proteção de rotas

## 🛠️ Tecnologias

- **NestJS**: Framework backend moderno
- **TypeScript**: Tipagem estática e segurança
- **Prisma**: ORM para banco de dados
- **SQLite**: Banco de dados relacional
- **JWT**: Autenticação segura
- **Swagger**: Documentação interativa

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm, yarn ou pnpm

### Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/MarkDosProgramas/back-rocketlab.git
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure o ambiente**

   ```bash
   # Crie o banco de dados e execute as migrações
   npx prisma migrate dev

   # Gere o cliente Prisma
   npx prisma generate

   # Execute o seed para criar dados iniciais
   npm run seed
   ```

4. **Inicie o servidor**

   ```bash
   npm run start:dev
   ```

5. **Acesse a documentação**
   - http://localhost:3000/api

## 👥 Dados Pré-cadastrados

O sistema vem com dados pré-cadastrados para facilitar os testes:

### 👑 Usuário Admin

- **Email**: admin@rocketlab.com
- **Senha**: admin123
- **Função**: Administrador

### 👤 Usuário Comum

- **Email**: user@rocketlab.com
- **Senha**: user123
- **Função**: Cliente

### 📦 Produtos

O sistema já vem com 8 produtos cadastrados em diferentes categorias:

- Eletrônicos (MacBook, Fone, Mouse, etc)
- Roupas (Camiseta Rocket)
- Livros (Clean Code)
- Jogos (Zelda: TOTK)
- Acessórios (Mochila)

## 🔑 Autenticação

### Registro

```http
POST /auth/register
{
  "name": "Usuário Teste",
  "email": "usuario@teste.com",
  "password": "senha123"
}
```

### Login

```http
POST /auth/login
{
  "email": "usuario@teste.com",
  "password": "senha123"
}
```

## 📦 Endpoints

### Produtos

- `GET /products` - Lista todos os produtos
- `GET /products/:id` - Detalhes de um produto
- `POST /products` - Cria produto (Admin)
- `PATCH /products/:id` - Atualiza produto (Admin)
- `DELETE /products/:id` - Remove produto (Admin)

### Carrinho

- `GET /cart` - Ver carrinho atual
- `POST /cart/items` - Adicionar item
- `PATCH /cart/items/:id` - Atualizar quantidade
- `DELETE /cart/items/:id` - Remover item
- `POST /cart/checkout` - Finalizar compra

## 🔒 Níveis de Acesso

### 👤 Usuário Comum

- Ver produtos
- Gerenciar próprio carrinho
- Realizar compras

### 👑 Administrador

- Tudo do usuário comum
- Gerenciar produtos
- Criar/editar/remover produtos

## 💡 Exemplos

### Adicionar Produto (Admin)

```http
POST /products
{
  "name": "Notebook Gamer",
  "description": "Notebook para jogos de última geração",
  "price": 5999.99,
  "stock": 10,
  "category": "ELETRONICOS"
}
```

### Adicionar ao Carrinho

```http
POST /cart/items
{
  "productId": 1,
  "quantity": 1
}
```

### Checkout

```http
POST /cart/checkout
```

## 🔍 Ferramentas de Desenvolvimento

### Prisma Studio

Visualize e edite dados do banco:

```bash
npx prisma studio
```

### Swagger UI

Teste a API e veja a documentação:

- http://localhost:3000/api

## 📝 Notas

- Todos os endpoints autenticados requerem o token JWT no header
- Mantenha suas credenciais seguras

---
