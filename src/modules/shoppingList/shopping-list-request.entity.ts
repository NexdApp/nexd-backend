import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ShoppingList} from './shopping-list.entity';

@Entity({
  name: 'shoppingListRequest',
})
export class ShoppingListRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  requestId!: number;

  @ManyToOne(
    type => ShoppingList,
    shoppingList => shoppingList.requests,
  )
  shoppingList!: ShoppingList;
}
