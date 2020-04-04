import { ApiProperty } from '@nestjs/swagger';

export class CallQueryDto {
  @ApiProperty({
    description: '',
    type: 'integer',
  })
  amount?: number;

  country?: string;

  @ApiProperty({
    description: '',
    type: 'integer',
  })
  zip?: number;

  city?: string;

  converted?: boolean;
}
