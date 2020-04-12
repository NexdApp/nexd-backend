import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { PhoneController } from './phone.controller';
import { PhoneService } from './phone.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from './call.entity';
import * as twilio from 'twilio';
import { HelpRequest } from '../helpRequests/help-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Call, HelpRequest])],
  exports: [PhoneService],
  controllers: [PhoneController],
  providers: [PhoneService],
})
export class PhoneModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(twilio.webhook({ validate: true }))
      .forRoutes(
        { path: 'twilio/call', method: RequestMethod.POST },
        { path: 'twilio/recorded', method: RequestMethod.POST },
      );
  }
}
