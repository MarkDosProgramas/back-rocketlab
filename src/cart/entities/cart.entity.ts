import { ApiProperty } from '@nestjs/swagger';

export class CartItem {
  @ApiProperty({ description: 'ID do item no carrinho' })
  id: number;

  @ApiProperty({ description: 'Quantidade do produto' })
  quantity: number;

  @ApiProperty({ description: 'Preço do produto no momento da adição' })
  price: number;

  @ApiProperty({ description: 'ID do produto' })
  productId: number;

  @ApiProperty({ description: 'ID do carrinho' })
  cartId: number;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;

  @ApiProperty({ description: 'Informações do produto' })
  product?: any;
}

export class Cart {
  @ApiProperty({ description: 'ID do carrinho' })
  id: number;

  @ApiProperty({ description: 'Valor total do carrinho' })
  total: number;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;

  @ApiProperty({ description: 'Itens no carrinho', type: [CartItem] })
  items: CartItem[];
}
