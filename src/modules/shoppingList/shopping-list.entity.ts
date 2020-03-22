import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {ShoppingListRequest} from './shopping-list-request.entity';
import {ApiProperty} from '@nestjs/swagger';
import {ShoppingListStatus} from './shopping-list-status';

@Entity({
  name: 'shoppingList',
})
export class ShoppingList {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column()
  owner!: number;

  @ApiProperty()
  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @ApiProperty()
  @Column()
  @UpdateDateColumn()
  updated_at!: Date;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ShoppingListStatus,
    default: ShoppingListStatus.ACTIVE,
  })
  status!: string;

  @ApiProperty({type: [ShoppingListRequest]})
  @OneToMany(
    type => ShoppingListRequest,
    shoppingListRequest => shoppingListRequest.shoppingList,
    {cascade: true},
  )
  requests!: ShoppingListRequest[];
}

export class ShoppingListFillableFields {
  owner!: number;
}
