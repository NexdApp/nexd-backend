import { ConfigService } from '../config/config.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { User } from '../user/user.entity';
import { RequestEntity } from '../request/request.entity';
import { Article } from '../articles/article.entity';
import { ArticlesController } from '../articles/articles.controller';
import { ArticlesService } from '../articles/articles.service';
import { RequestModule } from '../request/request.module';
import { CallModule } from '../call/call.module';
import { UserModule } from '../user/user.module';
import { UserController } from '../user/user.controller';
import { RequestController } from '../request/request.controller';
import { UsersService } from '../user/user.service';
import { RequestService } from '../request/request.service';
import { ShoppingListController } from '../shoppingList/shopping-list.controller';
import { ShoppingList } from '../shoppingList/shopping-list.entity';
import { ShoppingListModule } from '../shoppingList/shopping-list.module';
import { ShoppingListService } from '../shoppingList/shopping-list.service';
import { AudioStorageController } from '../audio-storage/audio-storage.controller';
import { AudioStorageModule } from '../audio-storage/audio-storage.module';
import { AudioStorageService } from '../audio-storage/audio-storage.service';
import { AudioFile } from '../audio-storage/audio-storage.entity';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    DatabaseModule,
    RequestModule,
    UserModule,
    ShoppingListModule,
    TypeOrmModule.forFeature([
      User,
      Article,
      RequestEntity,
      ShoppingList,
      AudioFile,
    ]),
    CallModule,
    AudioStorageModule,
  ],
  controllers: [
    AppController,
    ArticlesController,
    UserController,
    RequestController,
    ShoppingListController,
    AudioStorageController,
  ],
  providers: [
    AppService,
    ArticlesService,
    UsersService,
    RequestService,
    ShoppingListService,
    AudioStorageService,
  ],
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
