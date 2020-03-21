import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestService } from './request.service';
import { Request } from './request.entity';
import { RequestController } from './request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  exports: [RequestService],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
