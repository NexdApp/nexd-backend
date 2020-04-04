import { Module } from '@nestjs/common';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from './call.entity';
import { ConfigurationModule } from 'src/configuration/configuration.module';

@Module({
  imports: [TypeOrmModule.forFeature([Call]), ConfigurationModule],
  exports: [CallsService],
  controllers: [CallsController],
  providers: [CallsService],
})
export class CallsModule { }
