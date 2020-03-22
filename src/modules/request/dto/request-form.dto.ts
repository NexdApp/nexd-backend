import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRequestArticleDto {
  @ApiProperty({
    required: true,
    description: 'Article ID received from the article list',
    type: 'integer',
  })
  readonly articleId!: number;

  @ApiProperty({
    required: true,
    description: 'Number of items',
    type: 'integer',
  })
  readonly articleCount!: number;
}

export class RequestFormDto {
  @ApiProperty({
    required: true,
    description: 'List of articles',
    type: [CreateRequestArticleDto],
  })
  readonly articles!: CreateRequestArticleDto[];

  @ApiProperty({
    required: true,
  })
  readonly address!: string;

  @ApiProperty({
    required: true,
  })
  readonly zipCode!: string;

  @ApiProperty({
    required: true,
  })
  readonly city!: string;

  @ApiProperty()
  readonly additionalRequest?: string;
  @ApiProperty()
  readonly deliveryComment?: string;
  @ApiProperty()
  readonly phoneNumber?: string;
}
