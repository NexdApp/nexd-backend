import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';

import { setupSwagger } from './swagger';
import { ConfigurationService } from './configuration/configuration.service';
import { requestLoggerMiddleware } from './middlewares/requestLogger.middleware';
import { HttpExceptionFilter } from './errorHandling/http-exception.filter';
import { AppService } from './app.service';

async function bootstrap() {
  const logger = new Logger('Main', true);

  const app = await NestFactory.create(AppModule);

  const globalPrefix = '/api/v1';
  setupSwagger(app, globalPrefix);

  app.use(requestLoggerMiddleware);

  const appConfigService: ConfigurationService = app.get(
    'ConfigurationService',
  );
  const port = appConfigService.APIPort;
  const rootUrl = appConfigService.get('API_ROOT_URL');

  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix(globalPrefix);

  // in case of heroku, the listen port is not exposed
  const externalAPIPort = appConfigService.get('API_PORT');

  const url = `${rootUrl}:${externalAPIPort}${globalPrefix}`;

  app.enableShutdownHooks();
  app.get(AppService).subscribeToShutdown(() => {
    console.log('close connection');
    app.close();
  });

  await app.listen(port);

  logger.log(`Listening to ${url}`);

  if (appConfigService.isDev) {
    logger.log(`API Documentation available at ${url}/docs`);
  }
}
bootstrap();
