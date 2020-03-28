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
}
