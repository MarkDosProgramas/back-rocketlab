import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class AddItemDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the product to add to the cart',
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    example: 1,
    description: 'The quantity of the product to add',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}
