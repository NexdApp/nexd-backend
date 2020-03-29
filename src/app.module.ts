import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './configuration/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ArticlesModule } from './modules/articles/articles.modules';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    ArticlesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
