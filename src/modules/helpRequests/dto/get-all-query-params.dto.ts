import { HelpRequestStatus } from '../help-request-status';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetAllQueryParams {
  @ApiProperty({
    name: 'userId',
    required: false,
    description:
      'If included, filter by userId, "me" for the requesting user, otherwise all users are replied. The excludeUserId query inverts the logic and excludes the given userId. ',
  })
  userId?: string;

  @ApiProperty({
    name: 'excludeUserId',
    required: false,
    description:
      'If true, the given userId (in query) is excluded (and not filtered for as default). Requires the userId query.',
  })
  @IsOptional()
  @Transform(val => val === 'true')
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
  @IsOptional()
  @Transform(val => val === 'true')
  includeRequester?: boolean;

  @ApiProperty({
    required: false,
    enum: HelpRequestStatus,
    enumName: 'HelpRequestStatus',
    description: 'Array of status to filter for',
  })
  @IsEnum(HelpRequestStatus, { each: true })
  status?: HelpRequestStatus[];
}
