import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, MinLength} from 'class-validator';
import {UserRole} from '../user/user-role';

export class RegisterPayload {
  @ApiProperty({required: true})
  @IsEmail()
  email!: string;

  @ApiProperty({required: true})
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({required: true})
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({required: false, enum: UserRole, default: UserRole.NONE})
  role?: string;

  @ApiProperty({required: true})
  @IsNotEmpty()
  @MinLength(5)
  password!: string;
}
