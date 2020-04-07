import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../configuration/configuration.service';
import { Request } from 'express';

@Injectable()
export class AdminSecretGuard implements CanActivate {
  constructor(private configService: ConfigurationService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const adminSecret = request.headers['x-admin-secret'];
    return adminSecret === this.configService.get('ADMIN_SECRET');
  }
}
