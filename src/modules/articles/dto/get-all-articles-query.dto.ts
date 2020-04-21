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

  startsWith?: string;

  @ApiProperty({
    required: false,
    enum: AvailableLanguages,
    enumName: 'AvailableLanguages',
  })
  language?: AvailableLanguages;
}
