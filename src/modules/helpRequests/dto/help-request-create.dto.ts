import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AddressModel } from '../../../models/address.model';
import { HelpRequestStatus } from '../help-request-status';

export class CreateHelpRequestArticleDto {
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

export class HelpRequestCreateDto extends AddressModel {
  @ApiProperty({
    required: true,
    description: 'List of articles',
    type: [CreateHelpRequestArticleDto],
  })
  readonly articles!: CreateHelpRequestArticleDto[];

  @ApiPropertyOptional({
    enum: HelpRequestStatus,
    default: HelpRequestStatus.PENDING,
    type: HelpRequestStatus,
  })
  status!: string;

  @ApiProperty()
  readonly additionalRequest?: string;
  @ApiProperty()
  readonly deliveryComment?: string;
  @ApiProperty()
  readonly phoneNumber?: string;
}
