import { Module } from '@nestjs/common';
import { ConfigurationService } from '../../configuration/configuration.service';
import { ConfigurationModule } from '../../configuration/configuration.module';
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigurationModule
  ],
  providers: [EmailService],
  controllers: [],
  exports: [],
})
export class EmailModule { }
