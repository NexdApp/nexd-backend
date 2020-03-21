import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({
    required: true,
    description: 'Full request object',
  })
  readonly articles!: CreateRequestArticleDto[];
}

class CreateRequestArticleDto {
  readonly articleId!: number;

  readonly articleCount!: number;
}
