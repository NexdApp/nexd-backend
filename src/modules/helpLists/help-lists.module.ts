import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpListsService } from './help-lists.service';
import { HelpListsController } from './help-lists.controller';
import { HelpList } from './help-list.entity';
import { HelpRequestsModule } from '../helpRequests/help-requests.module';
import { HelpRequest } from '../helpRequests/help-request.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    HelpRequestsModule,
    UsersModule,
    TypeOrmModule.forFeature([HelpList, HelpRequest]),
  ],
  exports: [HelpListsService],
  controllers: [HelpListsController],
  providers: [HelpListsService],
})
export class HelpListsModule {}
