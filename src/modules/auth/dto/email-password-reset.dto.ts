import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { HttpBadRequestErrors } from 'src/errorHandling/httpBadRequestErrors.type';

export class EmailPasswordResetDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail({}, { message: HttpBadRequestErrors.EMAIL_INVALID })
  email!: string;

  @IsNotEmpty()
  passwordResetToken!: string;

  @IsNotEmpty()
  password!: string;
}
