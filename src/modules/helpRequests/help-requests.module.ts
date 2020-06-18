import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpRequestsService } from './help-requests.service';
import { HelpRequest } from './help-request.entity';
import { HelpRequestsController } from './help-requests.controller';
import { UsersModule } from '../users/users.module';
import { ArticlesModule } from '../articles/articles.modules';

@Module({
  imports: [
    UsersModule,
    ArticlesModule,
    TypeOrmModule.forFeature([HelpRequest]),
  ],
  exports: [HelpRequestsService],
  controllers: [HelpRequestsController],
  providers: [HelpRequestsService],
})
export class HelpRequestsModule {}
