import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateItemQuantityDto {
  @ApiProperty({
    description: 'Nova quantidade do produto',
    example: 1,
    minimum: 0,
  })
  @IsInt({ message: 'A quantidade deve ser um número inteiro' })
  @Min(0, { message: 'A quantidade não pode ser negativa' })
  quantity: number;
}
