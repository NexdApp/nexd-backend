import { ApiProperty } from '@nestjs/swagger';

export class ConvertedHelpRequestDto {
  @ApiProperty({
    type: 'integer',
  })
  helpRequestId!: number;
}
