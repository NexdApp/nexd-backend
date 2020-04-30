import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { AvailableLanguages } from 'src/constants/languages';

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
    enum: AvailableLanguages,
    enumName: 'AvailableLanguages',
  })
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
