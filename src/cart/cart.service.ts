import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  private async getOrCreateCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
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
        userId,
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

  async addItem(userId: number, productId: number, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('A quantidade deve ser maior que zero');
    }

    const product = await this.productsService.findOne(productId);

    if (product.stock < quantity) {
      throw new BadRequestException(
        `Estoque insuficiente para o produto ${product.name}. Disponível: ${product.stock}`,
      );
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
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
      await this.prisma.cartItem.create({
        data: {
          quantity,
          price: product.price,
          productId,
          cartId: cart.id,
        },
      });
    }

    await this.productsService.update(productId, {
      stock: product.stock - quantity,
    });

    return this.recalculateCart(cart.id);
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await this.getOrCreateCart(userId);
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: { product: true },
    });

    if (!cartItem) {
      throw new NotFoundException(`Item ${itemId} não encontrado no carrinho`);
    }

    await this.productsService.update(cartItem.productId, {
      stock: cartItem.product.stock + cartItem.quantity,
    });

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.recalculateCart(cart.id);
  }

  async updateItemQuantity(userId: number, itemId: number, quantity: number) {
    if (quantity < 0) {
      throw new BadRequestException('A quantidade não pode ser negativa');
    }

    if (quantity === 0) {
      return this.removeItem(userId, itemId);
    }

    const cart = await this.getOrCreateCart(userId);
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
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

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    await this.productsService.update(cartItem.productId, {
      stock: cartItem.product.stock - stockDifference,
    });

    return this.recalculateCart(cart.id);
  }

  async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    for (const item of cart.items) {
      const product = await this.productsService.findOne(item.productId);
      await this.productsService.update(item.productId, {
        stock: product.stock + item.quantity,
      });
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.recalculateCart(cart.id);
  }

  async getCart(userId: number) {
    return this.getOrCreateCart(userId);
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

  async checkout(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    if (cart.items.length === 0) {
      throw new BadRequestException('O carrinho está vazio');
    }

    const purchaseItems = cart.items.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price,
    }));

    const total = purchaseItems.reduce((sum, item) => sum + item.subtotal, 0);

    const response = {
      total,
      purchaseDate: new Date(),
      items: purchaseItems,
      message: 'Compra finalizada com sucesso!',
    };

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { total: 0 },
    });

    return response;
  }
}
