import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Rocketlab Store API')
  .setVersion('1.0')
  .addTag('Authentication', 'User registration and authentication endpoints')
  .addTag('Products', 'Product management endpoints')
  .addTag('Shopping Cart', 'Shopping cart operations')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'access-token',
  )
  .build();
