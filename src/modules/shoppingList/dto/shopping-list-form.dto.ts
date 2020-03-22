import { ApiProperty } from '@nestjs/swagger';
import { ShoppingListStatus } from '../shopping-list-status';

export class ShoppingListFormDto {
  @ApiProperty({
    required: true,
    description: 'List of request IDs',
    type: [Number],
  })
  readonly requests!: number[];

  @ApiProperty({
    required: false,
    enum: ShoppingListStatus,
    default: ShoppingListStatus.ACTIVE,
  })
  status!: string;
}
