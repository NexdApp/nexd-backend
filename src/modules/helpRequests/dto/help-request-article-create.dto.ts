import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CreateOrUpdateHelpRequestArticleDto {
  readonly articleDone?: boolean;

  @ApiProperty({
    description: 'Number of items',
    type: 'integer',
    format: 'int64',
  })
  @IsNumber()
  @Min(1)
  readonly articleCount!: number;
}
