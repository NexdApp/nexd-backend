import { Module } from '@nestjs/common';
import { AudioStorageController } from './audio-storage.controller';
import { AudioStorageService } from './audio-storage.service';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { AudioFile } from './audio-storage.entity';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [TypeOrmModule.forFeature([AudioFile]), ConfigModule],
  exports: [AudioStorageService],
  controllers: [AudioStorageController],
  providers: [AudioStorageService],
})
export class AudioStorageModule {}
