import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get isDev(): boolean {
    return (
      this.configService.get('NODE_ENV') === 'development' ||
      this.configService.get('NODE_ENV') === 'development.local'
    );
  }

  get<T = any>(
    propertyPath: string,
    defaultValue: T = undefined,
  ): T | undefined {
    return this.configService.get<T | undefined>(propertyPath, defaultValue);
  }
}
