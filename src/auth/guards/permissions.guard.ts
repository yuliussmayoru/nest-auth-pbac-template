import {
  CanActivate, ExecutionContext, Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/roles.decorator';
import { permission } from 'process';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length) return true;

    const { user } = context.switchToHttp().getRequest();
    const  userPermissionCodes: string[] =
    user?.role?.permissions?.map((rp) => rp.permission.permissonCode) || [];

    return required.every((permission) => userPermissionCodes.includes(permission))
  }
}
