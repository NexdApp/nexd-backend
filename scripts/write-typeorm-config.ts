import fs = require('fs');

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

import { ConfigurationService } from '../src/configuration/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfigService: ConfigurationService = app.get(
    'ConfigurationService',
  );

  fs.writeFileSync(
    'ormconfig.json',
    JSON.stringify(appConfigService.getTypeOrmConfig(), null, 2),
  );
}
bootstrap();
