import { ApiProperty } from '@nestjs/swagger';
// import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'test@test.com' })
  // @IsEmail()
  email!: string;

  // @IsNotEmpty()
  firstName!: string;

  // @IsNotEmpty()
  lastName!: string;

  // @IsNotEmpty()
  // @MinLength(5)
  password!: string;
}
