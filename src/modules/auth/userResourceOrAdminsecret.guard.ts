import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { Request } from 'express';

@Injectable()
export class UserResourceOrAdminsecretGuard implements CanActivate {
  constructor(private configService: ConfigurationService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const adminSecret = request.headers['x-admin-secret'];
    const isAdminRequest =
      adminSecret === this.configService.get('ADMIN_SECRET');
    if (isAdminRequest) {
      return true;
    }

    // check if a resource is requested that is owned by a user
    // care about query and params with the name userId
  }
}
