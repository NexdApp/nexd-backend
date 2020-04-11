import { HelpRequestStatus } from '../help-request-status';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllQueryParams {
  userId?: string;

  excludeUserId?: boolean;

  @ApiProperty({
    name: 'zipCode',
    type: [String],
    required: false,
    description: 'Filter by an array of zipCodes',
  })
  zipCode?: string[];

  @ApiProperty({
    name: 'includeRequester',
    required: false,
    description:
      'If "true", the requester object is included in each help request',
  })
  includeRequester?: boolean;

  @ApiProperty({
    name: 'status',
    isArray: true,
    required: false,
    enum: HelpRequestStatus,
    description: 'Array of status to filter for',
  })
  @IsEnum(HelpRequestStatus, { each: true })
  status?: HelpRequestStatus[];
}
