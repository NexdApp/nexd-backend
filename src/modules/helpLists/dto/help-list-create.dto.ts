import { ApiProperty } from '@nestjs/swagger';
import { HelpListStatus } from '../help-list-status';

export class HelpListCreateDto {
  @ApiProperty({
    description: 'List of help request IDs',
    type: 'array',
    items: {
      type: 'integer',
      format: 'int64',
    },
  })
  helpRequestsIds?: number[];

  status?: HelpListStatus = HelpListStatus.ACTIVE;
}
