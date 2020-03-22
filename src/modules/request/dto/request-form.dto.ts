import { ApiProperty } from '@nestjs/swagger';
import { AddressModel } from '../../main/models/address.model';

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

export class RequestFormDto extends AddressModel {
  @ApiProperty({
    required: true,
    description: 'List of articles',
    type: [CreateRequestArticleDto],
  })
  readonly articles!: CreateRequestArticleDto[];

  @ApiProperty()
  readonly additionalRequest?: string;
  @ApiProperty()
  readonly deliveryComment?: string;
  @ApiProperty()
  readonly phoneNumber?: string;
}
