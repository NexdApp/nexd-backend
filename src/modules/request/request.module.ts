import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestService } from './request.service';
import { RequestEntity } from './request.entity';
import { RequestController } from './request.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([RequestEntity])],
  exports: [RequestService],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
