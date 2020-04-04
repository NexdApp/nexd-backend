import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationService } from './configuration.service';
import { User } from '../modules/users/user.entity';
import { Article } from '../modules/articles/article.entity';
import { HelpRequest } from '../modules/helpRequests/help-request.entity';
import { HelpRequestArticle } from '../modules/helpRequests/help-request-article.entity';
import { HelpList } from '../modules/helpLists/help-list.entity';

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
          entities: [User, Article, HelpRequest, HelpRequestArticle, HelpList],
          synchronize: true,
          // migrations: [__dirname + '/../../../migrations/*.ts'],
          // cli: {
          //   migrationsDir: __dirname + '/../../../migrations',
          // },
          ssl: configService.get<string>('DATABASE_SSL') === 'true',
          logging: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
