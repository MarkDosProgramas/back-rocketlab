import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  private async getOrCreateCart() {
    // Buscar o primeiro carrinho ou criar um novo se não existir
    const cart = await this.prisma.cart.findFirst({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (cart) {
      return cart;
    }

    return this.prisma.cart.create({
      data: {
        total: 0,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async addItem(productId: number, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('A quantidade deve ser maior que zero');
    }

    const product = await this.productsService.findOne(productId);

    if (product.stock < quantity) {
      throw new BadRequestException(
        `Estoque insuficiente para o produto ${product.name}. Disponível: ${product.stock}`,
      );
    }

    const cart = await this.getOrCreateCart();

    // Verificar se o produto já está no carrinho
    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      // Atualizar quantidade do item existente
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        throw new BadRequestException(
          `Estoque insuficiente para o produto ${product.name}. Disponível: ${product.stock}`,
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Adicionar novo item
      await this.prisma.cartItem.create({
        data: {
          quantity,
          price: product.price,
          productId,
          cartId: cart.id,
        },
      });
    }

    // Atualizar estoque do produto
    await this.productsService.update(productId, {
      stock: product.stock - quantity,
    });

    // Recalcular total e retornar carrinho atualizado
    return this.recalculateCart(cart.id);
  }

  async removeItem(itemId: number) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!cartItem) {
      throw new NotFoundException(`Item ${itemId} não encontrado no carrinho`);
    }

    // Restaurar estoque do produto
    await this.productsService.update(cartItem.productId, {
      stock: cartItem.product.stock + cartItem.quantity,
    });

    // Remover item
    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    // Recalcular total e retornar carrinho atualizado
    return this.recalculateCart(cartItem.cartId);
  }

  async updateItemQuantity(itemId: number, quantity: number) {
    if (quantity < 0) {
      throw new BadRequestException('A quantidade não pode ser negativa');
    }

    if (quantity === 0) {
      return this.removeItem(itemId);
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!cartItem) {
      throw new NotFoundException(`Item ${itemId} não encontrado no carrinho`);
    }

    const stockDifference = quantity - cartItem.quantity;

    if (cartItem.product.stock < stockDifference) {
      throw new BadRequestException(
        `Estoque insuficiente para o produto ${cartItem.product.name}. Disponível: ${cartItem.product.stock}`,
      );
    }

    // Atualizar quantidade do item
    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    // Atualizar estoque do produto
    await this.productsService.update(cartItem.productId, {
      stock: cartItem.product.stock - stockDifference,
    });

    // Recalcular total e retornar carrinho atualizado
    return this.recalculateCart(cartItem.cartId);
  }

  async clearCart() {
    const cart = await this.getOrCreateCart();

    // Restaurar estoque dos produtos
    for (const item of cart.items) {
      const product = await this.productsService.findOne(item.productId);
      await this.productsService.update(item.productId, {
        stock: product.stock + item.quantity,
      });
    }

    // Remover todos os itens
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Retornar carrinho vazio
    return this.recalculateCart(cart.id);
  }

  async getCart() {
    return this.getOrCreateCart();
  }

  private async recalculateCart(cartId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    const total = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return this.prisma.cart.update({
      where: { id: cartId },
      data: { total },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async checkout() {
    const cart = await this.getOrCreateCart();

    if (cart.items.length === 0) {
      throw new BadRequestException('O carrinho está vazio');
    }

    // Calcular o total e preparar os itens para a resposta
    const purchaseItems = cart.items.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price,
    }));

    const total = purchaseItems.reduce((sum, item) => sum + item.subtotal, 0);

    // Criar o objeto de resposta
    const response = {
      total,
      purchaseDate: new Date(),
      items: purchaseItems,
      message: 'Compra finalizada com sucesso!',
    };

    // Limpar o carrinho após a finalização da compra
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Atualizar o total do carrinho para zero
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { total: 0 },
    });

    return response;
  }
}
