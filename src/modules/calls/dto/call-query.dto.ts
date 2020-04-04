import { ApiProperty } from '@nestjs/swagger';

export class CallQueryDto {
  @ApiProperty({
    description: '',
    type: 'integer',
  })
  amount?: number;

  @ApiProperty({
    description: '',
    type: 'string',
  })
  country?: string;

  @ApiProperty({
    description: '',
    type: 'integer',
  })
  zip?: number;

  @ApiProperty({
    description: '',
    type: 'string',
  })
  city?: string;

  @ApiProperty({
    description: '',
    type: 'boolean',
  })
  converted?: boolean;
}
