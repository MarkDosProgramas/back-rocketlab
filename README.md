# 🚀 Sistema de Compras Online

Bem-vindo ao nosso sistema de compras online! Esta é uma API robusta e moderna construída com as melhores práticas de desenvolvimento.

## 💻 Tecnologias

- **NestJS**: Framework Node.js para construção de APIs escaláveis
- **TypeScript**: Superset JavaScript que adiciona tipagem estática
- **Prisma**: ORM moderno para Node.js e TypeScript
- **SQLite**: Banco de dados leve e eficiente
- **Swagger**: Documentação interativa da API

## ✨ Funcionalidades

### Produtos

- Criar, listar, atualizar e deletar produtos
- Controle automático de estoque
- Validação de preços e quantidades

### Carrinho de Compras

- Carrinho único e persistente
- Adicionar produtos ao carrinho
- Atualizar quantidade de itens
- Remover itens específicos
- Limpar carrinho completo
- Cálculo automático de totais
- Validações automáticas:
  - Estoque disponível
  - Preços válidos
  - Quantidades positivas
  - Produtos existentes

## 🚀 Como Rodar o Projeto

1. **Clone o repositório**

   ```bash
   git clone https://github.com/MarkDosProgramas/back-rocketlab.git
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure o banco de dados**

   ```bash
   npx prisma migrate dev
   ```

4. **Inicie o servidor**

   ```bash
   npm run start:dev
   ```

5. **Acesse a documentação**
   - Abra seu navegador
   - Acesse: http://localhost:3000/api
   - Você verá a interface do Swagger com todos os endpoints

## 📝 Exemplos de Uso

### Criar um Produto

```http
POST /products
{
  "name": "Produto Legal",
  "description": "Uma descrição incrível",
  "price": 99.99,
  "stock": 10
}
```

### Adicionar ao Carrinho

```http
POST /cart/items
{
  "productId": 1,
  "quantity": 2
}
```

### Atualizar Quantidade no Carrinho

```http
PATCH /cart/items/{itemId}
{
  "quantity": 3
}
```

### Remover Item do Carrinho

```http
DELETE /cart/items/{itemId}
```

### Limpar Carrinho

```http
DELETE /cart/clear
```

### Ver Carrinho Atual

```http
GET /cart
```

## ⚠️ Validações e Mensagens de Erro

O sistema inclui diversas validações para garantir a integridade dos dados:

- Produtos com estoque zerado não podem ser adicionados ao carrinho
- Quantidades negativas não são permitidas
- Preços devem ser maiores que zero
- Validação automática de estoque disponível
- Mensagens de erro claras e informativas

## 🔍 Monitoramento

Você pode visualizar o banco de dados usando o Prisma Studio:

```bash
npx prisma studio
```
