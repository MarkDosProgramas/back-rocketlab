import { PrismaClient, Role, Category } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rocketlab.com' },
    update: {},
    create: {
      email: 'admin@rocketlab.com',
      name: 'Administrador',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@rocketlab.com' },
    update: {},
    create: {
      email: 'user@rocketlab.com',
      name: 'Usuário Teste',
      password: userPassword,
      role: Role.USER,
    },
  });

  const products = [
    {
      name: 'MacBook Pro M2',
      description: 'Notebook Apple com chip M2, 8GB RAM, 256GB SSD',
      price: 9999.99,
      stock: 10,
      category: Category.ELETRONICOS,
    },
    {
      name: 'Camiseta Rocket',
      description: 'Camiseta 100% algodão com estampa exclusiva',
      price: 79.9,
      stock: 50,
      category: Category.ROUPAS,
    },
    {
      name: 'Fone de Ouvido Bluetooth',
      description: 'Fone sem fio com cancelamento de ruído',
      price: 299.9,
      stock: 30,
      category: Category.ELETRONICOS,
    },
    {
      name: 'Clean Code',
      description: 'Livro Clean Code: A Handbook of Agile Software Craftsmanship',
      price: 119.9,
      stock: 20,
      category: Category.LIVROS,
    },
    {
      name: 'Mouse Gamer RGB',
      description: 'Mouse gamer 16000 DPI com iluminação RGB',
      price: 249.9,
      stock: 25,
      category: Category.ELETRONICOS,
    },
    {
      name: 'The Legend of Zelda: TOTK',
      description: 'The Legend of Zelda: Tears of the Kingdom - Nintendo Switch',
      price: 349.9,
      stock: 15,
      category: Category.JOGOS,
    },
    {
      name: 'Smartwatch Pro',
      description: 'Relógio inteligente com monitor cardíaco',
      price: 899.9,
      stock: 12,
      category: Category.ELETRONICOS,
    },
    {
      name: 'Mochila para Notebook',
      description: 'Mochila impermeável para notebooks até 15"',
      price: 159.9,
      stock: 40,
      category: Category.ACESSORIOS,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }

  console.log('🌱 Seed executado com sucesso!');
  console.log('👤 Usuários criados:');
  console.log(`   Admin: ${admin.email} (senha: admin123)`);
  console.log(`   User:  ${user.email} (senha: user123)`);
  console.log(`📦 ${products.length} produtos criados`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
