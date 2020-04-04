import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HelpList } from './help-list.entity';
import { HelpRequest } from '../helpRequests/help-request.entity';
import { HelpListCreateDto } from './dto/help-list-create.dto';
import { HelpListStatus } from './help-list-status';

@Injectable()
export class HelpListsService {
  static LOGGER = new Logger('HelpLists', true);

  constructor(
    @InjectRepository(HelpList)
    private readonly helpListsRepository: Repository<HelpList>,
    @InjectRepository(HelpRequest)
    private readonly requestRepository: Repository<HelpRequest>,
  ) {}

  async getById(
    userId: string,
    helpListId: number,
    options: {
      checkOwner: boolean;
    } = { checkOwner: true },
  ) {
    const where: any = {};
    if (options.checkOwner) {
      where.ownerId = userId;
    }
    const helpLists = await this.helpListsRepository.findOne(helpListId, {
      where,
      relations: ['helpRequests', 'helpRequests.articles'],
    });
    if (!helpLists) {
      throw new NotFoundException('Help List not found');
    }
    return helpLists;
  }

  async create(userId: string, createRequestDto: HelpListCreateDto) {
    const helpList = new HelpList();
    if (createRequestDto.helpRequestsIds) {
      // take the help requests and update them

      helpList.helpRequests = createRequestDto.helpRequestsIds.map(h => ({
        id: h,
      }));
    }
    helpList.ownerId = userId;
    helpList.status = HelpListStatus.ACTIVE;

    return this.helpListsRepository.save(helpList);
  }

  async getAllByUser(userId: string) {
    return await this.helpListsRepository.find({
      where: { ownerId: userId },
      relations: ['helpRequests'],
    });
  }

  async update(
    userId: string,
    helpList: HelpList,
    helpListUpdate: HelpListCreateDto,
  ): Promise<HelpList> {
    if (userId !== helpList.ownerId) {
      throw new ForbiddenException('The help list does not belong to you');
    }
    if (helpListUpdate.status) {
      helpList.status = helpListUpdate.status;
    }
    if (helpListUpdate.helpRequestsIds) {
      helpList.helpRequests = helpListUpdate.helpRequestsIds.map(id => {
        const re = new HelpRequest();
        re.id = id;
        return re;
      });
    }
    return await this.helpListsRepository.save(helpList);
  }

  // async removeRequest(requestId: number, HelpLists: HelpLists) {
  //   const index = HelpLists.requests.findIndex(
  //     r => r.requestId === Number(requestId),
  //   );
  //   if (index > -1) {
  //     HelpLists.requests.splice(index, 1);
  //     const request = await this.requestRepository.findOne(requestId);
  //     if (!request) {
  //       throw new BadRequestException('The request does not exist');
  //     }
  //     request.status = RequestStatus.PENDING;
  //     await this.requestRepository.save(request);
  //     return await this.helpListsRepository.save(HelpLists);
  //   } else {
  //     throw new BadRequestException('Does not exists');
  //   }
  // }

  // private populateHelpLists(
  //   requestIds:
  // ) {
  //   if (helpListCreateDto.helpRequestIds) {
  //     helpListCreateDto.helpRequestIds.forEach(async reqId => {
  //       await this.addRequestToList(reqId, to);
  //     });
  //   }
  // }

  // private async addRequestToList(requestId: number, list: HelpLists) {
  //   if (!list.requests.find(r => r.requestId === requestId)) {
  //     const request = await this.requestRepository.findOne(requestId);
  //     if (!request) {
  //       throw new BadRequestException('The request does not exist');
  //     }
  //     const newRequest = new HelpListsRequest();
  //     newRequest.requestId = requestId;
  //     list.requests.push(newRequest);

  //     request.status = RequestStatus.ONGOING;
  //     return await this.requestRepository.save(request);
  //   }
  // }
}
