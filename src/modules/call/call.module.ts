import { Module } from '@nestjs/common';
import { CallController } from './call.controller';
import { CallService } from './call.service';
import { AudioStorageModule } from '../audio-storage/audio-storage.module';

@Module({
  imports: [AudioStorageModule],
  controllers: [CallController],
  providers: [CallService],
})
export class CallModule {}
