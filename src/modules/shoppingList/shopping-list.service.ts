import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
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
  static LOGGER = new Logger('ShoppingList', true);

  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListRepository: Repository<ShoppingList>,
  ) {
  }

  async get(id: number) {
    const shoppingList = await this.shoppingListRepository.findOne(id, {relations: ['requests']});
    if (!shoppingList) {
      throw new NotFoundException('Shopping List not found');
    }
    return shoppingList;
  }

  async create(createRequestDto: ShoppingListFormDto, user: UserID) {
    const shoppingList = new ShoppingList();
    shoppingList.requests = [];
    this.populateShoppingList(createRequestDto, shoppingList);
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
    this.populateShoppingList(form, shoppingList);
    return await this.shoppingListRepository.save(shoppingList);
  }

  async addRequestToList(requestId: number, shoppingList: ShoppingList) {
    if (!shoppingList.requests.find(r => r.requestId === requestId)) {
      const newRequest = new ShoppingListRequest();
      newRequest.requestId = requestId;
      shoppingList.requests.push(newRequest);
    } else {
      throw new BadRequestException('Already exists');
    }
    return await this.shoppingListRepository.save(shoppingList);
  }

  async removeRequest(requestId: number, shoppingList: ShoppingList) {
    const index = shoppingList.requests.findIndex(r => r.requestId === Number(requestId));
    ShoppingListService.LOGGER.log(index);
    ShoppingListService.LOGGER.log(shoppingList);
    if (index > -1) {
      shoppingList.requests.splice(index, 1);
    } else {
      throw new BadRequestException('Does not exists');
    }
    return await this.shoppingListRepository.save(shoppingList);
  }

  private populateShoppingList(from: ShoppingListFormDto, to: ShoppingList) {
    to.status = from.status;
    if (from.requests) {
      from.requests.forEach(reqId => {
        if (!to.requests.find(r => r.requestId === reqId)) {
          const newRequest = new ShoppingListRequest();
          newRequest.requestId = reqId;
          to.requests.push(newRequest);
        }
      });
    }
  }
}
