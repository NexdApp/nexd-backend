import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    required: true,
    description: 'Name of the article, should also contain the unit.',
  })
  readonly name!: string;
}
