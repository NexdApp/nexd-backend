import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { AvailableLanguages } from '../../../constants/languages';

export class GetAllArticlesQueryParams {
  @ApiProperty({
    name: 'limit',
    required: false,
    description: 'Maximum number of articles ',
  })
  limit?: number;

  @ApiProperty({
    required: false,
    name: 'startsWith',
    description: 'Starts with the given string. Empty string does not filter.',
  })
  startsWith?: string;

  @ApiProperty({
    required: false,
    name: 'contains',
    description:
      'Contains with the given string. Empty string does not filter.',
  })
  contains?: string;

  @ApiProperty({
    required: false,
    name: 'orderByPopularity',
    description:
      'If true, orders by the most frequent used articles first. Defaults to false.',
  })
  @IsOptional()
  @Transform(val => val === 'true')
  orderByPopularity?: boolean;

  @ApiProperty({
    required: false,
    enum: AvailableLanguages,
    enumName: 'AvailableLanguages',
  })
  @IsEnum(AvailableLanguages)
  language?: AvailableLanguages;

  @ApiProperty({
    required: false,
    name: 'onlyVerified',
    description:
      'true to only gets the list of curated articles (default: true)',
  })
  @IsOptional()
  @Transform(val => val !== 'false')
  onlyVerified?: boolean;
}
