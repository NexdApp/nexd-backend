import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RequestService} from './request.service';
import {Request} from './request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  exports: [RequestService],
  providers: [RequestService],
})
export class RequestModule {
}
