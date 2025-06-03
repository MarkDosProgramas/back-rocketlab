import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class JwtPayload {
  @ApiProperty({
    example: 1,
    description: 'The user ID (subject)',
  })
  sub: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @ApiProperty({
    enum: Role,
    example: Role.USER,
    description: 'The role of the user (USER or ADMIN)',
  })
  role: Role;

  @ApiProperty({
    example: 1709731200,
    description: 'Token expiration timestamp (in seconds)',
  })
  exp?: number;

  @ApiProperty({
    example: 1709727600,
    description: 'Token issued at timestamp (in seconds)',
  })
  iat?: number;
}
