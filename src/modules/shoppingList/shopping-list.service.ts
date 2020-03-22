import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {Roles} from '../common/decorators/roles.decorator';
import {ShoppingList} from './shopping-list.entity';
import {ShoppingListFormDto} from './dto/shopping-list-form.dto';
import {ShoppingListStatus} from './shopping-list-status';
import {ShoppingListRequest} from './shopping-list-request.entity';
import {UserID} from '../user/user.entity';

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

  async create(createRequestDto: ShoppingListFormDto, user: UserID) {
    const shoppingList = new ShoppingList();
    shoppingList.requests = [];
    createRequestDto.requests.forEach(reqId => {
      const newRequest = new ShoppingListRequest();
      newRequest.id = reqId;
      shoppingList.requests.push(newRequest);
    });
    shoppingList.owner = user.userId;
    shoppingList.status = ShoppingListStatus.ACTIVE;

    return this.shoppingListRepository.save(shoppingList);
  }

  async getAllByUser(userId: number) {
    return await this.shoppingListRepository.find({
      where: {owner: userId},
      relations: ['requests'],
    });
  }

  async update(form: ShoppingListFormDto, shoppingList: ShoppingList) {
    shoppingList.status = form.status;
    form.requests.forEach(reqId => {
      const newRequest = new ShoppingListRequest();
      newRequest.id = reqId;
      shoppingList.requests.push(newRequest);
    });
    return await this.shoppingListRepository.save(shoppingList);
  }

  async addRequestToList(requestId: number, shoppingList: ShoppingList) {
    const newRequest = new ShoppingListRequest();
    newRequest.id = requestId;
    shoppingList.requests.push(newRequest);
    return await this.shoppingListRepository.save(shoppingList);
  }
}
