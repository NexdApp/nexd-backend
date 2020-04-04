import { ApiProperty } from '@nestjs/swagger';

export class CallQueryDto {
  amount?: number;

  country?: string;

  zip?: number;

  city?: string;

  converted?: boolean;
}
