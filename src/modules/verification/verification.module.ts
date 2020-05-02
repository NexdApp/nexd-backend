import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { UsersModule } from '../users/users.module';
import { VerificationController } from './verification.controller';
import { ConfigurationModule } from '../../configuration/configuration.module';

@Module({
  imports: [
    UsersModule,
    ConfigurationModule,
  ],
  providers: [VerificationService],
  controllers: [VerificationController],
  exports: [VerificationService],
})
export class VerificationModule {}
