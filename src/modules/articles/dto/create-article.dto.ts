import { ApiProperty } from '@nestjs/swagger';
import { AvailableLanguages } from 'src/constants/languages';

export class CreateArticleDto {
  @ApiProperty({
    required: true,
    description: 'Name of the article, should also contain the unit.',
  })
  readonly name!: string;

  readonly language!: AvailableLanguages;
}
