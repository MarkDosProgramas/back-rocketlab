import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.debug(`Checking route access - isPublic: ${isPublic}`);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.debug(`Required roles: ${JSON.stringify(requiredRoles)}`);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    this.logger.debug(`User from request: ${JSON.stringify(user)}`);

    if (!user) {
      throw new ForbiddenException('No user found in request');
    }

    if (!user.role) {
      throw new ForbiddenException('User has no role assigned');
    }

    const hasRole = requiredRoles.includes(user.role);
    this.logger.debug(`User role ${user.role} has required role: ${hasRole}`);

    if (!hasRole) {
      throw new ForbiddenException(
        `User role ${user.role} is not authorized. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
