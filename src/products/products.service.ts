import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Product } from './entities/product.entity';
import { Category } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existingProduct) {
      throw new BadRequestException(
        `Já existe um produto com o nome "${data.name}". ID do produto existente: ${existingProduct.id}`,
      );
    }

    // Validações existentes
    if (data.stock <= 0) {
      throw new BadRequestException('O estoque do produto não pode ser zero ou negativo');
    }

    if (data.price <= 0) {
      throw new BadRequestException('O preço do produto deve ser maior que zero');
    }

    // Se passar por todas as validações, cria o produto
    return this.prisma.product.create({ data });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return product;
  }

  async update(
    id: number,
    data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Product> {
    const product = await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Product> {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async findByCategory(category: Category): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { category },
    });
  }
}
