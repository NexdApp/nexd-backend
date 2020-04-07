import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { UserController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
  controllers: [UserController],
  providers: [UsersService],
})
export class UsersModule {}
