import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Roles } from '../common/decorators/roles.decorator';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingListFormDto } from './dto/shopping-list-form.dto';
import { ShoppingListStatus } from './shopping-list-status';
import { ShoppingListRequest } from './shopping-list-request.entity';
import { UserID } from '../user/user.entity';
import { RequestEntity } from '../request/request.entity';
import { RequestStatus } from '../request/request-status';

@Injectable()
@Roles('helper')
export class ShoppingListService {
  static LOGGER = new Logger('ShoppingList', true);

  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListRepository: Repository<ShoppingList>,
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
  ) {}

  async get(id: number) {
    const shoppingList = await this.shoppingListRepository.findOne(id, {
      relations: ['requests'],
    });
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
      where: { owner: userId },
      relations: ['requests'],
    });
  }

  async update(form: ShoppingListFormDto, shoppingList: ShoppingList) {
    this.populateShoppingList(form, shoppingList);
    return await this.shoppingListRepository.save(shoppingList);
  }

  async removeRequest(requestId: number, shoppingList: ShoppingList) {
    const index = shoppingList.requests.findIndex(
      r => r.requestId === Number(requestId),
    );
    if (index > -1) {
      shoppingList.requests.splice(index, 1);
      const request = await this.requestRepository.findOne(requestId);
      if (!request) {
        throw new BadRequestException('The request does not exist');
      }
      request.status = RequestStatus.PENDING;
      await this.requestRepository.save(request);
      return await this.shoppingListRepository.save(shoppingList);
    } else {
      throw new BadRequestException('Does not exists');
    }
  }

  private populateShoppingList(from: ShoppingListFormDto, to: ShoppingList) {
    to.status = from.status;
    if (from.requests) {
      from.requests.forEach(async reqId => {
        await this.addRequestToList(reqId, to);
      });
    }
  }

  private async addRequestToList(requestId: number, list: ShoppingList) {
    if (!list.requests.find(r => r.requestId === requestId)) {
      const request = await this.requestRepository.findOne(requestId);
      if (!request) {
        throw new BadRequestException('The request does not exist');
      }
      const newRequest = new ShoppingListRequest();
      newRequest.requestId = requestId;
      list.requests.push(newRequest);

      request.status = RequestStatus.ONGOING;
      return await this.requestRepository.save(request);
    }
  }
}
