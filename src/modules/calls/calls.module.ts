import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from './call.entity';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import * as twilio from 'twilio';

@Module({
  imports: [TypeOrmModule.forFeature([Call]), ConfigurationModule],
  exports: [CallsService],
  controllers: [CallsController],
  providers: [CallsService],
})
export class CallsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(twilio.webhook({ validate: true }))
      .forRoutes(
        { path: 'twilio/call', method: RequestMethod.POST },
        { path: 'twilio/recorded', method: RequestMethod.POST },
      )
  }
}
