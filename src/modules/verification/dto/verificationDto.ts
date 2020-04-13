import { IsNumber, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerificationDto {
  @ApiProperty({ example: '+49123456789' })
  @IsPhoneNumber(null)
  phoneNumber!: string;

  @ApiProperty({ example: 123456 })
  @IsNumber()
  OTP: number;
}

export class RequestDto {
  @ApiProperty({ example: '+49123456789' })
  @IsPhoneNumber(null)
  phoneNumber!: string;
}
