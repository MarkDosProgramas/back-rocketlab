import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Cart } from './entities/cart.entity';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemQuantityDto } from './dto/update-item-quantity.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Obter o carrinho atual' })
  @ApiResponse({
    status: 200,
    description: 'Carrinho retornado com sucesso',
    type: Cart,
  })
  getCart() {
    return this.cartService.getCart();
  }

  @Post('items')
  @ApiOperation({ summary: 'Adicionar item ao carrinho' })
  @ApiResponse({
    status: 201,
    description: 'Item adicionado com sucesso',
    type: Cart,
  })
  addItem(@Body() addItemDto: AddItemDto) {
    return this.cartService.addItem(addItemDto.productId, addItemDto.quantity);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiResponse({
    status: 200,
    description: 'Item removido com sucesso',
    type: Cart,
  })
  removeItem(@Param('itemId') itemId: string) {
    return this.cartService.removeItem(+itemId);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Atualizar quantidade de um item' })
  @ApiResponse({
    status: 200,
    description: 'Quantidade atualizada com sucesso',
    type: Cart,
  })
  updateItemQuantity(
    @Param('itemId') itemId: string,
    @Body() updateItemQuantityDto: UpdateItemQuantityDto,
  ) {
    return this.cartService.updateItemQuantity(+itemId, updateItemQuantityDto.quantity);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Limpar o carrinho' })
  @ApiResponse({
    status: 200,
    description: 'Carrinho limpo com sucesso',
    type: Cart,
  })
  clearCart() {
    return this.cartService.clearCart();
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Finalizar compra' })
  @ApiResponse({
    status: 200,
    description: 'Compra finalizada com sucesso',
    schema: {
      properties: {
        total: { type: 'number', example: 299.97 },
        purchaseDate: { type: 'string', format: 'date-time' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productName: { type: 'string' },
              quantity: { type: 'number' },
              price: { type: 'number' },
              subtotal: { type: 'number' },
            },
          },
        },
        message: { type: 'string' },
      },
    },
  })
  checkout() {
    return this.cartService.checkout();
  }
}
