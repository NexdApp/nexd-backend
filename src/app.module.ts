import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './configuration/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ArticlesModule } from './modules/articles/articles.modules';
import { HelpRequestsModule } from './modules/helpRequests/help-requests.module';
import { HelpListsModule } from './modules/helpLists/help-lists.module';
import { PhoneModule } from './modules/phone/phone.module';
import { LocalInfosModule } from './modules/locationInfos/locationInfos.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    ArticlesModule,
    HelpRequestsModule,
    HelpListsModule,
    PhoneModule,
    LocalInfosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
