import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { Logger } from '@nestjs/common';

import { AppConfigService } from './configuration/configuration.service';

async function bootstrap() {
  const logger = new Logger('Main', true);

  const app = await NestFactory.create(AppModule);

  const appConfigService: AppConfigService = app.get('AppConfigService');
  const port = appConfigService.get('API_PORT');
  const rootUrl = appConfigService.get('API_ROOT_URL');

  app.enableCors();
  app.use(helmet());

  const globalPrefix = '/api';
  app.setGlobalPrefix(globalPrefix);

  const url = `${rootUrl}:${port}${globalPrefix}`;

  await app.listen(port);

  logger.log(`Listening to ${url}`);

  if (appConfigService.isDev) {
    Logger.log(`API Documentation available at ${url}/docs`);
  }
}
bootstrap();
