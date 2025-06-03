import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password for the account (minimum 6 characters)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Mark',
    description: 'The full name of the user',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    enum: Role,
    default: Role.USER,
    description: 'The role of the user (defaults to USER)',
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
