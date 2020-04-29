import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { BackendErrors } from '../../../errorHandling/backendErrors.type';

export class EmailPasswordResetDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail({}, { message: BackendErrors.VALIDATION_EMAIL_INVALID })
  email!: string;

  @IsNotEmpty()
  passwordResetToken!: string;

  @IsNotEmpty()
  password!: string;
}
