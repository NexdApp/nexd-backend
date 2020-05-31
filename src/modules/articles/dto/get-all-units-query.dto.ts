import { ApiProperty } from '@nestjs/swagger';
import { AvailableLanguages } from '../../../constants/languages';
import { IsEnum, IsOptional } from 'class-validator';

export class GetAllUnitsQueryParams {
  @ApiProperty({
    required: false,
    enum: AvailableLanguages,
    enumName: 'AvailableLanguages',
  })
  @IsEnum(AvailableLanguages)
  @IsOptional()
  language?: AvailableLanguages;
}
