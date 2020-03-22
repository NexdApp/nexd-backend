import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

export class TranslatedCallPayloadDto {
  @ApiProperty({
    required: true,
    description: 'translator of the call',
  })
  @IsString()
  readonly translator!: string;

  @ApiProperty({
    required: true,
    description: 'Date when the translation was finished'
  })
  @IsString()
  readonly date!: string;

  @ApiProperty({
    required: true,
    description: 'Mark if translation is completed'
  })
  @IsBoolean()
  readonly finished!: boolean;
}
