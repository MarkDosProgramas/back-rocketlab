import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class AddItemDto {
  @ApiProperty({
    description: 'ID do produto a ser adicionado',
    example: 1,
  })
  @IsInt({ message: 'O ID do produto deve ser um número inteiro' })
  @IsPositive({ message: 'O ID do produto deve ser positivo' })
  productId: number;

  @ApiProperty({
    description: 'Quantidade do produto',
    example: 1,
    minimum: 1,
  })
  @IsInt({ message: 'A quantidade deve ser um número inteiro' })
  @IsPositive({ message: 'A quantidade deve ser positiva' })
  quantity: number;
}
