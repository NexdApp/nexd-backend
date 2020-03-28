import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/modules/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log(__dirname);
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: Number(configService.get<string>('DATABASE_PORT')),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: true,
          // migrations: [__dirname + '/../../src/migrations/*.ts'],
          // cli: {
          //   migrationsDir: __dirname + '/../../src/migrations',
          // },
          ssl: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
