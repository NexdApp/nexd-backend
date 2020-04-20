import { ApiProperty } from '@nestjs/swagger';
import { AvailableLanguages } from 'src/constants/languages';

export class CreateArticleDto {
  @ApiProperty({
    required: true,
    description:
      'Name of the article. If the name already exists, no new article will be added.',
  })
  readonly name!: string;

  @ApiProperty({
    required: true,
    description: 'Language of the article, e.g. the user',
  })
  readonly language!: AvailableLanguages;
}
