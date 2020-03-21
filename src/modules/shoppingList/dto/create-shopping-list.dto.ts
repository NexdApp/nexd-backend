import {ApiProperty} from '@nestjs/swagger';
import {ShoppingListStatus} from '../shopping-list-status';

export class CreateShoppingListDto {
  @ApiProperty({
    required: true,
    description: 'List of request IDs',
    type: [Number],
  })
  readonly requests!: number[];

  @ApiProperty({
    required: true,
    enum: ShoppingListStatus,
    default: ShoppingListStatus.ACTIVE,
  })
  status!: string;
}
