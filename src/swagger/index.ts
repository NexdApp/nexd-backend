import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_NAME,
  SWAGGER_API_ROOT,
} from './constants';

import { ConfigurationService } from '../configuration/configuration.service';

export const setupSwagger = (app: INestApplication, globalPrefix: string) => {
  const configService = app.get(ConfigurationService);
  const apiRootUrl = configService.get('API_ROOT_URL');
  // in case of heroku, the listen port is not exposed
  const externalAPIPort = configService.get('API_PORT');

  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addServer(`${apiRootUrl}:${externalAPIPort}${globalPrefix}`)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  const css = [
    {
      class: 'topbar',
      content:
        'background: linear-gradient(180deg, #4EBF96 23.44%, #0C2E45 100%);',
    },
  ];
  Logger.log(css);

  const compiled = css
    .map(value => {
      return `.${value.class}{${value.content}}`;
    })
    .join(' ');

  SwaggerModule.setup(SWAGGER_API_ROOT, app, document, {
    customCss: compiled,
    customSiteTitle: SWAGGER_API_NAME + ' - Swagger',
  });
};
