import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { HttpBadRequestErrors } from 'src/errorHandling/httpBadRequestErrors.type';

export class LoginDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail({}, { message: HttpBadRequestErrors.EMAIL_INVALID })
  email!: string;

  @IsNotEmpty()
  password!: string;
}
