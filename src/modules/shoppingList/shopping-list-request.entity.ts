import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ShoppingList } from './shopping-list.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'shoppingListRequest',
})
export class ShoppingListRequest {
  @PrimaryGeneratedColumn()
  @ApiHideProperty()
  id!: number;

  @ApiProperty({ required: true, type: 'integer' })
  @Column()
  requestId!: number;

  @ManyToOne(
    type => ShoppingList,
    shoppingList => shoppingList.requests,
  )
  shoppingList!: ShoppingList;
}
