import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { PhoneController } from './phone.controller';
import { PhoneService } from './phone.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from './call.entity';
import * as twilio from 'twilio';
import { HelpRequest } from '../helpRequests/help-request.entity';
import { HelpRequestsModule } from '../helpRequests/help-requests.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    HelpRequestsModule,
    TypeOrmModule.forFeature([Call, HelpRequest]),
  ],
  exports: [PhoneService],
  controllers: [PhoneController],
  providers: [PhoneService],
})
export class PhoneModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(twilio.webhook({ validate: true }))
      .forRoutes(
        { path: 'twilio/incoming-call', method: RequestMethod.POST },
        { path: 'twilio/record-callback', method: RequestMethod.POST },
      );
  }
}
