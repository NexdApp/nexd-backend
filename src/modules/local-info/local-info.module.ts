import { Module } from '@nestjs/common';
import { LocalInfoController } from './local-info.controller';
import { LocalInfoService } from './local-info.service';
import { LocalInfo } from './local-info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LocalInfo])],
  exports: [LocalInfoService],
  controllers: [LocalInfoController],
  providers: [LocalInfoService]
})
export class LocalInfoModule {}
