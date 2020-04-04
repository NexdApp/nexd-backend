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
import { HelpRequestStatus } from '../helpRequests/help-request-status';

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
      relations: [
        'helpRequests',
        'helpRequests.articles',
        'helpRequests.articles.article',
      ],
    });
    if (!helpLists) {
      throw new NotFoundException('Help List not found');
    }
    return helpLists;
  }

  async create(userId: string, createRequestDto: HelpListCreateDto) {
    const helpList = new HelpList();
    if (createRequestDto.helpRequestsIds) {
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
      relations: [
        'helpRequests',
        'helpRequests.requester',
        'helpRequests.articles',
        'helpRequests.articles.article',
      ],
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
      // remove old ones
      helpList.helpRequests.forEach(
        r => (r.status = HelpRequestStatus.PENDING),
      );
      await this.helpListsRepository.save(helpList);

      helpList.helpRequests = helpListUpdate.helpRequestsIds.map(id => {
        const re = new HelpRequest();
        re.id = id;
        re.status = HelpRequestStatus.ONGOING;
        return re;
      });
    }
    return await this.helpListsRepository.save(helpList);
  }

  async addRequest(
    userId: string,
    helpList: HelpList,
    helpRequest: HelpRequest,
  ): Promise<HelpList> {
    if (userId !== helpList.ownerId) {
      throw new ForbiddenException('The help list does not belong to you');
    }
    helpRequest.status = HelpRequestStatus.ONGOING;
    helpList.helpRequests.push(helpRequest);
    return await this.helpListsRepository.save(helpList);
  }

  async removeRequest(
    userId: string,
    helpList: HelpList,
    helpRequest: HelpRequest,
  ): Promise<HelpList> {
    if (userId !== helpList.ownerId) {
      throw new ForbiddenException('The help list does not belong to you');
    }
    helpRequest.status = HelpRequestStatus.PENDING;
    helpList.helpRequests = helpList.helpRequests.filter(
      request => request.id != helpRequest.id,
    );
    return await this.helpListsRepository.save(helpList);
  }

  async changeArticleDoneForRequest(
    userId: string,
    helpList: HelpList,
    helpRequestId: number,
    articleId: number,
    articleDone: boolean,
  ) {
    if (userId !== helpList.ownerId) {
      throw new ForbiddenException('The help list does not belong to you');
    }

    const helpRequest = helpList.helpRequests.find(
      request => request.id === helpRequestId,
    );

    if (!helpRequest) {
      throw new NotFoundException('The help request is not in this help list');
    }

    const article = helpRequest.articles.find(
      art => art.articleId === articleId,
    );

    if (!article) {
      throw new NotFoundException('Article not found in request');
    }
    article.articleDone = articleDone;
    return await this.helpListsRepository.save(helpList);
  }

  async changeArticleDoneForAll(
    userId: string,
    helpList: HelpList,
    helpRequestId: number,
    articleId: number,
    articleDone: boolean,
  ) {}
}
