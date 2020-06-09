import { ApiProperty } from '@nestjs/swagger';
import { AvailableLanguages } from '../../../constants/languages';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    required: true,
    description:
      'Name of the article. If the name already exists, no new article will be added.',
  })
  @IsNotEmpty()
  readonly name!: string;

  @ApiProperty({
    required: true,
    description: 'Language of the article, e.g. the user',
    enum: AvailableLanguages,
    enumName: 'AvailableLanguages',
  })
  @IsEnum(AvailableLanguages)
  readonly language!: AvailableLanguages;
}
