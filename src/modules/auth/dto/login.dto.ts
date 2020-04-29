import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { BackendErrors } from '../../../errorHandling/backendErrors.type';

export class LoginDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail({}, { message: BackendErrors.VALIDATION_EMAIL_INVALID })
  email!: string;

  @IsNotEmpty()
  password!: string;
}
