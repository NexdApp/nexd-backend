import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ required: true, enum: ['helper', 'seeker'] })
  @IsNotEmpty()
  role!: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  telephone?: string;
}
