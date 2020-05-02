import { ApiProperty } from '@nestjs/swagger';
import { AddressModel } from '../../../models/address.model';
import { HelpRequestStatus } from '../help-request-status';
import { IsPhoneNumber, IsOptional, IsEnum } from 'class-validator';
import { AvailableLanguages } from 'src/constants/languages';

export class CreateHelpRequestArticleDto {
  @ApiProperty({
    description: 'Article ID received from the article list',
    type: 'integer',
    format: 'int64',
    required: false,
  })
  readonly articleId?: number;

  @ApiProperty({
    description: 'Name of the article, in case a new one should be created',
    required: false,
  })
  readonly articleName?: string;

  @ApiProperty({
    required: false,
    description: 'Language of the article, e.g. the user',
  })
  @IsOptional()
  @IsEnum(AvailableLanguages)
  readonly language!: AvailableLanguages;

  @ApiProperty({
    description: 'Number of items',
    type: 'integer',
    format: 'int64',
  })
  readonly articleCount!: number;

  @ApiProperty({
    description: 'Id of the unit',
    type: 'integer',
    format: 'int64',
    required: false,
  })
  readonly unitId?: number;
}

export class HelpRequestCreateDto extends AddressModel {
  readonly articles?: CreateHelpRequestArticleDto[];

  readonly status?: HelpRequestStatus = HelpRequestStatus.PENDING;

  readonly additionalRequest?: string;
  readonly deliveryComment?: string;

  @IsOptional()
  @IsPhoneNumber('ZZ')
  readonly phoneNumber?: string;
}
