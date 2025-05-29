import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryValidationPipe implements PipeTransform<string, Category> {
  transform(value: string): Category {
    const upperValue = value.toUpperCase();

    if (!Object.values(Category).includes(upperValue as Category)) {
      throw new BadRequestException(
        `Categoria inválida. Categorias válidas são: ${Object.values(Category).join(', ')}`,
      );
    }

    return upperValue as Category;
  }
}
