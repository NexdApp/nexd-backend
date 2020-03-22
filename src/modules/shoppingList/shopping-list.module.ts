import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ShoppingListService} from './shopping-list.service';
import {ShoppingListController} from './shopping-list.controller';
import {ShoppingList} from './shopping-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingList])],
  exports: [ShoppingListService],
  controllers: [ShoppingListController],
  providers: [ShoppingListService],
})
export class ShoppingListModule {
}
