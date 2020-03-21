import { ConfigService } from '../config/config.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { User } from '../user/user.entity';
import { CallModule } from 'modules/call/call.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    CallModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule /* implements NestModule */ {
  static port: string | number;
  static isDev: boolean;

  constructor(private readonly config: ConfigService) {
    AppModule.port = process.env.PORT || config.get('API_PORT');
    AppModule.isDev = config.isDev;
  }

  // DOC: https://docs.nestjs.com/middleware
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(loggerMiddleware)
  //     .forRoutes({ path: '/', method: RequestMethod.ALL });
  // }
}
