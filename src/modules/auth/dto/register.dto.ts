import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength, IsPhoneNumber, IsOptional } from 'class-validator';
import { HttpBadRequestErrors } from '../../../errorHandling/httpBadRequestErrors.type';

export class RegisterDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail(
    {},
    {
      message: HttpBadRequestErrors.EMAIL_INVALID,
    },
  )
  email!: string;

  firstName?: string;

  lastName?: string;

  @IsOptional()
  @IsPhoneNumber('ZZ', { message: HttpBadRequestErrors.PHONENUMBER_INVALID })
  phoneNumber?: string;

  @MinLength(8, { message: HttpBadRequestErrors.PASSWORD_TOO_SHORT })
  password!: string;
}
