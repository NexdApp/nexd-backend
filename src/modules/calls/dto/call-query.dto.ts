import { ApiProperty } from '@nestjs/swagger';

export class CallQueryDto {
  @ApiProperty({
    description: '',
    type: 'integer',
  })
  amount?: number;

  country?: string;

  zip?: string;

  city?: string;

  converted?: boolean;
}
