import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  email!: string;

  firstName?: string;

  lastName?: string;

  @MinLength(8)
  password!: string;
}
