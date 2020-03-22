import { Module } from '@nestjs/common';
import { AudioStorageController } from './audio-storage.controller';
import { AudioStorageService } from './audio-storage.service';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { AudioFile } from './audio-storage.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AudioFile])],
  controllers: [AudioStorageController],
  providers: [AudioStorageService]
})
export class AudioStorageModule {}
