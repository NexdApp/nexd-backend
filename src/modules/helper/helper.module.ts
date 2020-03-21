import { Module } from '@nestjs/common';
import { HelpersService } from './helper.service';
import { Helper } from './helper.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'modules/user/user.module';
import { User } from 'modules/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Helper]),
  ],
  exports: [HelpersService],
  providers: [HelpersService],
})
export class HelperModule {}
