import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationService } from './configuration.service';
import { User } from 'src/modules/users/user.entity';
import { Article } from 'src/modules/articles/article.entity';
import { HelpRequest } from 'src/modules/helpRequests/help-request.entity';
import { HelpRequestArticle } from 'src/modules/helpRequests/help-request-article.entity';

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
          entities: [User, Article, HelpRequest, HelpRequestArticle],
          synchronize: true,
          // migrations: [__dirname + '/../../src/migrations/*.ts'],
          // cli: {
          //   migrationsDir: __dirname + '/../../src/migrations',
          // },
          ssl: configService.get<string>('DATABASE_NAME') === 'true',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
