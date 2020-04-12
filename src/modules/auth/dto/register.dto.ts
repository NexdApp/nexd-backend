import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength, IsPhoneNumber, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  email!: string;

  firstName?: string;

  lastName?: string;

  @IsOptional()
  @IsPhoneNumber('ZZ')
  phoneNumber?: string;

  @MinLength(8)
  password!: string;
}
