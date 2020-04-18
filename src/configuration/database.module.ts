import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseProviders } from './database.providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationService } from './configuration.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigurationService) => {
        let dbConfig: any = {
          host: configService.get<string>('DATABASE_HOST'),
          port: Number(configService.get<string>('DATABASE_PORT')),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
        };
        if (configService.get<string>('DATABASE_URL')) {
          dbConfig = {
            url: configService.get<string>('DATABASE_URL'),
          };
        }
        return {
          type: 'postgres',
          ...dbConfig,
          // autoLoadEntities: true,
          // entities: [User, Article, HelpRequest, HelpRequestArticle, HelpList],
          entities: [__dirname + '/../**/*.entity.{ts,js}'],
          synchronize: true,
          // migrations: [__dirname + '/../../src/migrations/*.ts'],
          // cli: {
          //   migrationsDir: __dirname + '/../../src/migrations',
          // },
          ssl: configService.get<string>('DATABASE_SSL') === 'true',
          logging: true,
        };
      },
    }),
  ],
  // providers: [...databaseProviders],
  // exports: [...databaseProviders],
})
export class DatabaseModule {}
