import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional } from 'class-validator';

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

  @ApiProperty({
    description: 'Unit id of the article',
    type: 'integer',
    format: 'int64',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly unitId?: number;
}
