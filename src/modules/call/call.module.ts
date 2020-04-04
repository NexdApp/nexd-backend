import { Module } from '@nestjs/common';
import { CallController } from './call.controller';
import { CallService } from './call.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from './call.entity';
import { ConfigModule } from 'modules/config/config.module';
import { LocalInfoModule } from 'modules/local-info/local-info.module';

@Module({
  imports: [TypeOrmModule.forFeature([Call]), ConfigModule, LocalInfoModule],
  exports: [CallService],
  controllers: [CallController],
  providers: [CallService],
})
export class CallModule {}
