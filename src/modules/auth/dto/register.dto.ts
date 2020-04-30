import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength, IsPhoneNumber, IsOptional } from 'class-validator';
import { BackendErrors } from '../../../errorHandling/backendErrors.type';

export class RegisterDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail(
    {},
    {
      message: BackendErrors.VALIDATION_EMAIL_INVALID,
    },
  )
  email!: string;

  firstName?: string;

  lastName?: string;

  @IsOptional()
  @IsPhoneNumber('ZZ', {
    message: BackendErrors.VALIDATION_PHONENUMBER_INVALID,
  })
  phoneNumber?: string;

  @MinLength(8, { message: BackendErrors.VALIDATION_PASSWORD_TOO_SHORT })
  password!: string;
}
