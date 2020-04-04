import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';

import { HelpRequest } from './help-request.entity';
import { HelpRequestCreateDto } from './dto/help-request-create.dto';
import { HelpRequestArticle } from './help-request-article.entity';
import { CreateOrUpdateHelpRequestArticleDto } from './dto/help-request-article-create.dto';
// import { HelpRequestArticleStatusDto } from '../helpList/dto/shopping-list-form.dto';

@Injectable()
export class HelpRequestsService {
  static LOGGER = new Logger('Request', true);

  constructor(
    @InjectRepository(HelpRequest)
    private readonly helpRequestRepository: Repository<HelpRequest>,
  ) {}

  async get(id: number) {
    return this.helpRequestRepository.findOne(id, {
      relations: ['articles', 'articles.article'],
    });
  }

  async create(createRequestDto: HelpRequestCreateDto, userId: string): Promise<HelpRequest> {
    const helpRequest = new HelpRequest();
    this.populateRequest(helpRequest, createRequestDto);
    helpRequest.requesterId = userId;

    return this.helpRequestRepository.save(helpRequest);
  }

  private populateRequest(
    helpRequest: HelpRequest,
    createRequestDto: HelpRequestCreateDto,
  ) {
    helpRequest.articles = [];
    if (createRequestDto.articles) {
      createRequestDto.articles.forEach(art => {
        const newArticle = new HelpRequestArticle();
        newArticle.articleId = art.articleId;
        newArticle.articleCount = art.articleCount;
        newArticle.articleDone = false;
        helpRequest.articles.push(newArticle);
      });
    }
    helpRequest.additionalRequest = createRequestDto.additionalRequest;
    helpRequest.phoneNumber = createRequestDto.phoneNumber;
    helpRequest.deliveryComment = createRequestDto.deliveryComment;
    helpRequest.city = createRequestDto.city;
    helpRequest.street = createRequestDto.street;
    helpRequest.number = createRequestDto.number;
    helpRequest.zipCode = createRequestDto.zipCode;
  }

  async getAll(filters: {
    userId?: string;
    zipCode?: string[];
    includeRequester?: boolean;
    excludeUserId?: boolean;
    status?: string[];
  }) {
    const where: any = {};
    const relations = ['articles', 'articles.article'];

    if (filters.userId) {
      if (filters.excludeUserId) {
        where.requesterId = Not(filters.userId);
      } else {
        where.requesterId = filters.userId;
      }
    }
    if (filters.zipCode) {
      where.zipCode = In(filters.zipCode);
    }
    if (filters.status) {
      where.status = In(filters.status);
    }
    if (filters.includeRequester) {
      relations.push('requester');
    }
    return await this.helpRequestRepository.find({
      where,
      relations,
    });
  }

  async addOrUpdateArticle(
    helpRequest: HelpRequest,
    articleId: number,
    helpRequestArticleDto: CreateOrUpdateHelpRequestArticleDto,
  ) {
    const oldArticle = helpRequest.articles.find(
      art => art.articleId === articleId,
    );
    if (oldArticle) {
      oldArticle.articleCount = helpRequestArticleDto.articleCount;
      if (typeof helpRequestArticleDto.articleDone === 'boolean') {
        oldArticle.articleDone = helpRequestArticleDto.articleDone;
      }
    } else {
      const newArticle = new HelpRequestArticle();
      newArticle.articleId = articleId;
      newArticle.articleCount = helpRequestArticleDto.articleCount;
      if (typeof helpRequestArticleDto.articleDone === 'boolean') {
        newArticle.articleDone = helpRequestArticleDto.articleDone;
      }
      helpRequest.articles.push(newArticle);
    }
    return await this.helpRequestRepository.save(helpRequest);
  }

  async removeArticle(helpRequest: HelpRequest, articleId: number) {
    const index = helpRequest.articles.findIndex(
      art => art.articleId == articleId,
    );
    if (index > -1) {
      helpRequest.articles.splice(index, 1);
    }
    return await this.helpRequestRepository.save(helpRequest);
  }

  async update(requestId: number, requestEntity: HelpRequestCreateDto) {
    const request: HelpRequest = await this.findRequest(requestId);
    this.populateRequest(request, requestEntity);

    return await this.helpRequestRepository.save(request);
  }

  private async findRequest(id: number) {
    const request: HelpRequest | undefined = await this.get(id);
    if (!request) {
      throw new NotFoundException('This request does not exist');
    }
    return request;
  }
}
