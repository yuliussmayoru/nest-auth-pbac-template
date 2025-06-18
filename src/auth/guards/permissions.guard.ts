import {
  CanActivate, ExecutionContext, Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/roles.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) return true;

    const { user } = context.switchToHttp().getRequest();
    const  userPermissions = user.permissions || []

    return required.every((permission) =>
      userPermissions.some(
        (p) => `${p.action}:${p.resource}` === permission
      )
    )
  }
}
