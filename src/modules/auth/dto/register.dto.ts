import { ApiProperty } from '@nestjs/swagger';
// import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ required: true, example: 'test@test.com' })
  // @IsEmail()
  email!: string;

  @ApiProperty({ required: true })
  // @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ required: true })
  // @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ required: true })
  // @IsNotEmpty()
  // @MinLength(5)
  password!: string;
}
