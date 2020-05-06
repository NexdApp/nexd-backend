import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

(async function() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Title')
    .setDescription('description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
})();
