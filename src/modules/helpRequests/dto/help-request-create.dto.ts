import { ApiProperty } from '@nestjs/swagger';
import { AddressModel } from '../../../models/address.model';
import { HelpRequestStatus } from '../help-request-status';

export class CreateHelpRequestArticleDto {
  @ApiProperty({
    description: 'Article ID received from the article list',
    type: 'long',
  })
  readonly articleId!: number;

  @ApiProperty({
    description: 'Number of items',
    type: 'long',
  })
  readonly articleCount!: number;
}

export class HelpRequestCreateDto extends AddressModel {
  readonly articles?: CreateHelpRequestArticleDto[];

  readonly status?: HelpRequestStatus = HelpRequestStatus.PENDING;

  readonly additionalRequest?: string;
  readonly deliveryComment?: string;
  readonly phoneNumber?: string;
}
