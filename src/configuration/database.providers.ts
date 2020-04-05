import { Provider } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigService } from '@nestjs/config';

export const databaseProviders: Provider[] = [
  {
    provide: 'DbConnectionToken',
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
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        synchronize: true,
        ssl: configService.get<string>('DATABASE_SSL') === 'true',
        logging: true,
      };
    },
    inject: [ConfigService],
  },
];
