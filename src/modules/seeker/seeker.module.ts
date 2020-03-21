import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Seeker } from './seeker.entity';
import { SeekersService } from './seeker.service';
import { UserModule } from 'modules/user/user.module';
import { User } from 'modules/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Seeker]),
  ],
  exports: [SeekersService],
  providers: [SeekersService],
})
export class SeekerModule {}
