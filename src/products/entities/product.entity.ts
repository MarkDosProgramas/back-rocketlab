import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@prisma/client';

export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}
