import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Cart } from './entities/cart.entity';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemQuantityDto } from './dto/update-item-quantity.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Shopping Cart')
@ApiBearerAuth('access-token')
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({
    summary: 'Get current cart',
    description: 'Returns the current shopping cart with all its items',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart returned successfully',
    type: Cart,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not logged in',
  })
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  @ApiOperation({
    summary: 'Add item to cart',
    description: 'Adds a product to the shopping cart with specified quantity',
  })
  @ApiBody({ type: AddItemDto })
  @ApiResponse({
    status: 201,
    description: 'Item added successfully',
    type: Cart,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data or insufficient stock',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not logged in',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  addItem(@Request() req, @Body() addItemDto: AddItemDto) {
    return this.cartService.addItem(req.user.id, addItemDto.productId, addItemDto.quantity);
  }

  @Delete('items/:itemId')
  @ApiOperation({
    summary: 'Remove item from cart',
    description: 'Removes a specific item from the shopping cart',
  })
  @ApiParam({
    name: 'itemId',
    description: 'The ID of the cart item to remove',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Item removed successfully',
    type: Cart,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not logged in',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found',
  })
  removeItem(@Request() req, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(req.user.id, +itemId);
  }

  @Patch('items/:itemId')
  @ApiOperation({
    summary: 'Update item quantity',
    description: 'Updates the quantity of a specific item in the cart',
  })
  @ApiParam({
    name: 'itemId',
    description: 'The ID of the cart item to update',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Item quantity updated successfully',
    type: Cart,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid quantity or insufficient stock',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not logged in',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found',
  })
  updateItemQuantity(
    @Request() req,
    @Param('itemId') itemId: string,
    @Body() updateItemQuantityDto: UpdateItemQuantityDto,
  ) {
    return this.cartService.updateItemQuantity(
      req.user.id,
      +itemId,
      updateItemQuantityDto.quantity,
    );
  }

  @Delete('clear')
  @ApiOperation({
    summary: 'Clear cart',
    description: 'Removes all items from the shopping cart',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart cleared successfully',
    type: Cart,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not logged in',
  })
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }

  @Post('checkout')
  @ApiOperation({
    summary: 'Checkout cart',
    description: 'Processes the purchase of all items in the cart',
  })
  @ApiResponse({
    status: 200,
    description: 'Checkout completed successfully',
    schema: {
      properties: {
        total: {
          type: 'number',
          example: 299.97,
          description: 'Total amount of the purchase',
        },
        purchaseDate: {
          type: 'string',
          format: 'date-time',
          description: 'Date and time of the purchase',
        },
        items: {
          type: 'array',
          description: 'List of purchased items',
          items: {
            type: 'object',
            properties: {
              productName: {
                type: 'string',
                example: 'iPhone 13',
                description: 'Name of the product',
              },
              quantity: {
                type: 'number',
                example: 2,
                description: 'Quantity purchased',
              },
              price: {
                type: 'number',
                example: 999.99,
                description: 'Price per unit',
              },
              subtotal: {
                type: 'number',
                example: 1999.98,
                description: 'Total price for this item',
              },
            },
          },
        },
        message: {
          type: 'string',
          example: 'Purchase completed successfully!',
          description: 'Confirmation message',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Empty cart',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not logged in',
  })
  checkout(@Request() req) {
    return this.cartService.checkout(req.user.id);
  }
}
