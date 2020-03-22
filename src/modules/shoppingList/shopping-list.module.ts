import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ShoppingListService} from './shopping-list.service';
import {ShoppingListController} from './shopping-list.controller';
import {ShoppingList} from './shopping-list.entity';
import {RequestModule} from '../request/request.module';

@Module({
  imports: [RequestModule, TypeOrmModule.forFeature([ShoppingList])],
  exports: [ShoppingListService],
  controllers: [ShoppingListController],
  providers: [ShoppingListService],
})
export class ShoppingListModule {
}
