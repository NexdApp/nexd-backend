import { ApiProperty } from '@nestjs/swagger';

export class ConvertedHelpRequest {
  @ApiProperty({
    type: 'integer',
  })
  helpRequestId: number;
}
