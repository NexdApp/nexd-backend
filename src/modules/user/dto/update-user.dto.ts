import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { AddressModel } from '../../main/models/address.model';

export class UpdateUserDto extends AddressModel {
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
  telephone?: string;
}
