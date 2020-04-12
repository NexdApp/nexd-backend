import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCallsQueryParams {
  @ApiProperty({
    name: 'userId',
    required: false,
    description:
      'If included, filter by userId, "me" for the requesting user, otherwise all users are replied. ',
  })
  userId?: string;

  @ApiProperty({
    name: 'limit',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    name: 'converted',
    required: false,
    description: `true if you only want to query calls which are already converted to a 
      'help request, false otherwise. Returns all calls if undefined.`,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  converted?: boolean;

  @ApiProperty({
    name: 'country',
    required: false,
  })
  country?: string;

  @ApiProperty({
    name: 'zip',
    required: false,
  })
  zip?: string;

  @ApiProperty({
    name: 'city',
    required: false,
  })
  city?: string;
}
