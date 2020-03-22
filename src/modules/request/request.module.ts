import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestService } from './request.service';
import { RequestEntity } from './request.entity';
import { RequestController } from './request.controller';
import {AddressModel} from '../main/models/address.model';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity])],
  exports: [RequestService],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
