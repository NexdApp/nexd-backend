import { ApiProperty } from '@nestjs/swagger';
import { ShoppingListStatus } from '../shopping-list-status';

export class ShoppingListFormDto {
  @ApiProperty({
    required: true,
    description: 'List of request IDs',
    type: ['integer'],
  })
  requests!: number[];

  @ApiProperty({
    required: false,
    enum: ShoppingListStatus,
    default: ShoppingListStatus.ACTIVE,
    type: ShoppingListStatus,
  })
  status!: string;
}

export class RequestArticleStatusDto {
  @ApiProperty({
    required: true,
  })
  articleDone!: boolean;
}
