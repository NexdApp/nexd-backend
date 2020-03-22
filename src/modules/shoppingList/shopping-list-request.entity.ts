import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ShoppingList} from './shopping-list.entity';
import {ApiProperty} from '@nestjs/swagger';

@Entity({
  name: 'shoppingListRequest',
})
export class ShoppingListRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({required: true})
  @Column()
  requestId!: number;

  @ManyToOne(
    type => ShoppingList,
    shoppingList => shoppingList.requests,
  )
  shoppingList!: ShoppingList;
}
