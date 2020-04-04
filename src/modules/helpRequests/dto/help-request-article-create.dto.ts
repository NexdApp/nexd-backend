import { ApiProperty } from '@nestjs/swagger';

export class CreateOrUpdateHelpRequestArticleDto {
  readonly articleDone?: boolean;

  @ApiProperty({
    description: 'Number of items',
    type: 'long',
  })
  readonly articleCount!: number;
}
