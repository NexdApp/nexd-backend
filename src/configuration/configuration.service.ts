import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  get isDev(): boolean {
    return (
      this.configService.get('NODE_ENV') === 'development' ||
      this.configService.get('NODE_ENV') === 'development.local'
    );
  }

  get APIPort(): number {
    if (this.configService.get('PORT')) {
      return this.configService.get('PORT');
    }
    return this.configService.get('API_PORT');
  }

  get<T = any>(
    propertyPath: string,
    defaultValue: T = undefined,
  ): T | undefined {
    return this.configService.get<T | undefined>(propertyPath, defaultValue);
  }

  getTypeOrmConfig(): TypeOrmModuleOptions {
    let dbConfig: any = {
      host: this.get<string>('DATABASE_HOST'),
      port: Number(this.get<string>('DATABASE_PORT')),
      username: this.get<string>('DATABASE_USERNAME'),
      password: this.get<string>('DATABASE_PASSWORD'),
      database: this.get<string>('DATABASE_NAME'),
    };
    if (this.get<string>('DATABASE_URL')) {
      dbConfig = {
        url: this.get<string>('DATABASE_URL'),
      };
    }

    return {
      type: 'postgres',
      ...dbConfig,
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      synchronize: this.get<string>('DATABASE_SYNCHRONIZE') === 'true',
      // migrationsRun: this.get<string>('DATABASE_MIGRATIONSRUN') === 'true',
      migrationsRun: false, // use typeorm cli
      migrations: [__dirname + '/../**/migrations/*.{ts,js}'],
      cli: {
        migrationsDir: 'src/migrations',
      },
      ssl: this.get<string>('DATABASE_SSL') === 'true',
      logging: this.isDev,
    };
  }
}
