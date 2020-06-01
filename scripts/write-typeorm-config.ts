import fs = require('fs');

import { NestFactory } from '@nestjs/core';

import { ConfigurationService } from '../src/configuration/configuration.service';
import { ConfigurationModule } from '../src/configuration/configuration.module';

async function bootstrap() {
  const app = await NestFactory.create(ConfigurationModule);

  const appConfigService: ConfigurationService = app.get(
    'ConfigurationService',
  );

  fs.writeFileSync(
    'ormconfig.json',
    JSON.stringify(appConfigService.getTypeOrmConfig(), null, 2),
  );
}
bootstrap();
