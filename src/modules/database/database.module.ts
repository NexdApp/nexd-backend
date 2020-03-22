import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { User } from '../user/user.entity';
import { RequestEntity } from '../request/request.entity';
import { Article } from '../articles/article.entity';
import { RequestArticle } from '../request/requestArticle.entity';
import { ShoppingList } from '../shoppingList/shopping-list.entity';
import { ShoppingListRequest } from '../shoppingList/shopping-list-request.entity';
import { AudioFile } from '../audio-storage/audio-storage.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ({
          type: config.databaseType,
          host: config.databaseHost,
          port: config.databasePort,
          database: config.databaseName,
          username: config.databaseUsername,
          password: config.databasePassword,
          // importing entities directly because Webpack + glob path pattern + ts file = crash
          // https://github.com/nestjs/nest/issues/711
          entities: [
            User,
            Article,
            RequestEntity,
            RequestArticle,
            ShoppingList,
            ShoppingListRequest,
            AudioFile,
          ], // ['src/modules/**/*.entity{.ts,.js}'],
          migrations: [
            User,
            Article,
            RequestEntity,
            RequestArticle,
            ShoppingList,
            ShoppingListRequest,
            AudioFile,
          ], // ['src/modules/**/*.migration{.ts,.js}'],
          synchronize: config.isDev,
          // synchronize: false,
          logging: !config.isProd,
          useNewUrlParser: true,
        } as TypeOrmModuleOptions),
    }),
  ],
})
export class DatabaseModule {}
