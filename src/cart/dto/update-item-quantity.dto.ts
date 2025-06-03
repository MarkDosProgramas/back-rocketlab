import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateItemQuantityDto {
  @ApiProperty({
    example: 2,
    description: 'The new quantity for the cart item',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  quantity: number;
}
