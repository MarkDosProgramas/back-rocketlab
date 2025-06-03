import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class User {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user',
  })
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
  })
  name: string;

  @ApiProperty({
    enum: Role,
    example: Role.USER,
    description: 'The role of the user (USER or ADMIN)',
  })
  role: Role;

  @ApiProperty({
    example: '2024-03-06T12:00:00.000Z',
    description: 'The date and time when the user was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-06T12:00:00.000Z',
    description: 'The date and time when the user was last updated',
  })
  updatedAt: Date;
}
