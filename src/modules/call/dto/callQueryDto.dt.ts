import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsBoolean } from 'class-validator';

export class CallQueryDto {
  @ApiProperty({
    description: '',
    type: 'integer',
  })
  //@IsNumber()
  amount?: number;

  @ApiProperty({
    description: '',
    type: 'string',
  })
  //@IsString()
  country?: string;

  @ApiProperty({
    description: '',
    type: 'integer',
  })
  //@IsNumber()
  zip?: number;

  @ApiProperty({
    description: '',
    type: 'string',
  })
  //@IsString()
  city?: string;

  @ApiProperty({
    description: '',
    type: 'boolean',
  })
  //@IsBoolean()
  converted?: boolean;
}
