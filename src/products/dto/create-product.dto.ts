import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, Min, IsOptional } from 'class-validator';
import { Category } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({
    example: 'iPhone 13',
    description: 'The name of the product',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Latest iPhone model with A15 Bionic chip',
    description: 'Detailed description of the product',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 999.99,
    description: 'The price of the product',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 100,
    description: 'The available stock quantity',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({
    enum: Category,
    default: Category.OUTROS,
    example: Category.ELETRONICOS,
    description: 'The category of the product',
  })
  @IsEnum(Category)
  @IsOptional()
  category?: Category;
}
