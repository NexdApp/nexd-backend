import { Module } from '@nestjs/common';

import { ConfigurationService } from './configuration.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.string(),
        DATABASE_PASSWORD: Joi.string(),
        DATABASE_NAME: Joi.string(),

        DATABASE_URL: Joi.string(),
        DATABASE_SSL: Joi.bool().default(false),

        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME_SECONDS: Joi.number().required(),

        ADMIN_SECRET: Joi.string().required(),

        // API_PORT: Joi.number().required(), // heroku sets PORT from external
        API_ROOT_URL: Joi.string().required(),
      })
        .xor('DATABASE_URL', 'DATABASE_HOST')
        .xor('DATABASE_URL', 'DATABASE_USERNAME')
        .xor('DATABASE_URL', 'DATABASE_PASSWORD')
        .xor('DATABASE_URL', 'DATABASE_NAME'),
    }),
  ],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
