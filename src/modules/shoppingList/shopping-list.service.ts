import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {Roles} from '../common/decorators/roles.decorator';
import {ShoppingList} from './shopping-list.entity';
import {CreateShoppingListDto} from './dto/create-shopping-list.dto';
import {ShoppingListStatus} from './shopping-list-status';
import {ShoppingListRequest} from './shopping-list-request.entity';

@Injectable()
@Roles('helper')
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListRepository: Repository<ShoppingList>,
  ) {
  }

  async get(id: number) {
    const shoppingList = await this.shoppingListRepository.findOne(id);
    if (!shoppingList) {
      throw new NotFoundException('Shopping List not found');
    }
    return shoppingList;
  }

  async create(createRequestDto: CreateShoppingListDto, user: any) {
    const shoppingList = new ShoppingList();
    shoppingList.requests = [];
    createRequestDto.requests.forEach(reqId => {
      const newRequest = new ShoppingListRequest();
      newRequest.id = reqId;
      shoppingList.requests.push(newRequest);
    });
    shoppingList.status = ShoppingListStatus.ACTIVE;

    return this.shoppingListRepository.save(shoppingList);
  }

  async getAll() {
    return await this.shoppingListRepository.find({relations: ['requests']});
  }
}
