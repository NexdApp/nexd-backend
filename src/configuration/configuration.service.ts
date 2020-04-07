import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  get isDev(): boolean {
    return (
      this.configService.get('NODE_ENV') === 'development' ||
      this.configService.get('NODE_ENV') === 'development.local'
    );
  }

  get APIPort(): number {
    if (this.configService.get('PORT')) {
      return this.configService.get('PORT');
    }
    return this.configService.get('API_PORT');
  }

  get<T = any>(
    propertyPath: string,
    defaultValue: T = undefined,
  ): T | undefined {
    return this.configService.get<T | undefined>(propertyPath, defaultValue);
  }
}
