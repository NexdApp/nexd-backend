import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../../configuration/configuration.module';
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigurationModule
  ],
  providers: [EmailService],
  controllers: [],
  exports: [EmailService],
})
export class EmailModule { }
