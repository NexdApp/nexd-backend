import { ApiProperty } from '@nestjs/swagger';

export class CreateOrUpdateHelpRequestArticleDto {
  readonly articleDone?: boolean;

  @ApiProperty({
    description: 'Number of items',
    type: 'integer',
    format: 'int64',
  })
  readonly articleCount!: number;
}
