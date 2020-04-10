import { Module } from '@nestjs/common';
import { LocationInfosService } from './locationInfos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationInfo } from './locationInfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocationInfo])],
  exports: [LocationInfosService],
  providers: [LocationInfosService]
})
export class LocalInfosModule { }
