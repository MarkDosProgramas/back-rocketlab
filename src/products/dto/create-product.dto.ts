import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@prisma/client';
import { IsString, IsNumber, IsPositive, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Nome do produto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descrição do produto' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Preço do produto' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ description: 'Quantidade em estoque' })
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty({
    description: 'Categoria do produto',
    enum: Category,
    default: Category.OUTROS,
  })
  @IsEnum(Category)
  category?: Category;
}
