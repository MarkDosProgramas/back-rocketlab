import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { Category } from '@prisma/client';
import { CategoryValidationPipe } from './pipes/category-validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get('categories')
  @ApiOperation({
    summary: 'List all categories',
    description: 'Returns a list of all available product categories',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories list returned successfully',
    schema: {
      type: 'array',
      items: {
        enum: Object.values(Category),
        example: ['ELETRONICOS', 'ROUPAS', 'ACESSORIOS', 'LIVROS', 'JOGOS', 'OUTROS'],
      },
    },
  })
  getCategories() {
    return Object.values(Category);
  }

  @Public()
  @Get('category/:category')
  @ApiOperation({
    summary: 'Get products by category',
    description: 'Returns all products in a specific category',
  })
  @ApiParam({
    name: 'category',
    enum: Category,
    description: 'The category to filter products by',
  })
  @ApiResponse({
    status: 200,
    description: 'Products list returned successfully',
    type: [Product],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid category',
  })
  findByCategory(@Param('category', CategoryValidationPipe) category: Category) {
    return this.productsService.findByCategory(category);
  }

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create product',
    description: 'Creates a new product (Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Not logged in',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not an admin',
  })
  async create(@Body() createProductDto: CreateProductDto) {
    this.logger.debug(`Creating product: ${JSON.stringify(createProductDto)}`);
    return this.productsService.create(createProductDto as Product);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'List all products',
    description: 'Returns a list of all products in the store',
  })
  @ApiResponse({
    status: 200,
    description: 'Products list returned successfully',
    type: [Product],
  })
  findAll() {
    return this.productsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Returns a single product by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Product found successfully',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update product',
    description: 'Updates an existing product (Admin only)',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to update',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Not logged in',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not an admin',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async update(@Param('id') id: string, @Body() updateProductDto: CreateProductDto) {
    this.logger.debug(`Updating product ${id}: ${JSON.stringify(updateProductDto)}`);
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete product',
    description: 'Deletes an existing product (Admin only)',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to delete',
    type: 'number',
  })
  @ApiResponse({
    status: 204,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Not logged in',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not an admin',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async remove(@Param('id') id: string) {
    this.logger.debug(`Deleting product ${id}`);
    return this.productsService.remove(+id);
  }
}
