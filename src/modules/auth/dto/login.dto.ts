import { ApiProperty } from '@nestjs/swagger';
// import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'test@test.com' })
  email!: string;

  password!: string;
}
