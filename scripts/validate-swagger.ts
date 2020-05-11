import * as path from 'path';
import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import * as SwaggerParser from '@apidevtools/swagger-parser';

import {
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_NAME,
} from '../src/swagger/constants';

(async function() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addBearerAuth()
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));

  try {
    const api = await SwaggerParser.validate(
      path.join(__dirname, '../swagger-spec.json'),
    );
    console.log('API name: %s, Version: %s', api.info.title, api.info.version);
    process.exit(0);
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
})();
