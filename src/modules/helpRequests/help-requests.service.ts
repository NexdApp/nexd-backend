import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';

import { HelpRequest } from './help-request.entity';
import { HelpRequestCreateDto } from './dto/help-request-create.dto';
import { HelpRequestArticle } from './help-request-article.entity';
import { CreateOrUpdateHelpRequestArticleDto } from './dto/help-request-article-create.dto';
import { Article } from '../articles/article.entity';
import { BackendErrors } from '../../errorHandling/backendErrors.type';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class HelpRequestsService {
  static LOGGER = new Logger('Request', true);

  constructor(
    @InjectRepository(HelpRequest)
    private readonly helpRequestRepository: Repository<HelpRequest>,
    @Inject(ArticlesService)
    private readonly articlesService: ArticlesService,
  ) {}

  async getById(id: number) {
    const helpRequest:
      | HelpRequest
      | undefined = await this.helpRequestRepository.findOne(id, {
      relations: [
        'articles',
        'articles.article',
        'articles.unit',
        'requester',
        'call',
      ],
    });
    if (!helpRequest) {
      throw new NotFoundException('Help request not found');
    }
    return helpRequest;
  }

  async create(
    createRequestDto: HelpRequestCreateDto,
    userId: string,
  ): Promise<HelpRequest> {
    const helpRequest = new HelpRequest();
    await this.populateRequest(helpRequest, createRequestDto);
    helpRequest.requesterId = userId;

    return this.helpRequestRepository.save(helpRequest);
  }

  private async populateRequest(
    helpRequest: HelpRequest,
    createRequestDto: HelpRequestCreateDto,
  ) {
    if (createRequestDto.articles) {
      helpRequest.articles = [];
      for (const art of createRequestDto.articles) {
        let savedArticle: Article | undefined;

        const newArticle = new HelpRequestArticle();
        newArticle.articleId = art.articleId;
        newArticle.articleCount = art.articleCount;
        newArticle.articleDone = false;
        newArticle.unitId = art.unitId;

        // create article in case no id is given
        if (art.articleId === undefined) {
          if (!art.language) {
            throw new BadRequestException(
              BackendErrors.ARTICLE_ARTICLE_NEEDS_LANGUAGE,
            );
          }
          if (!art.articleName) {
            throw new BadRequestException(
              BackendErrors.ARTICLE_ARTICLE_NEEDS_NAME,
            );
          }
          const articleDto = {
            name: art.articleName,
            language: art.language,
          };
          savedArticle = await this.articlesService.createArticle(articleDto);

          newArticle.articleId = savedArticle.id;
        }

        helpRequest.articles.push(newArticle);
      }
    }
    helpRequest.status = createRequestDto.status;
    helpRequest.additionalRequest = createRequestDto.additionalRequest;
    helpRequest.phoneNumber = createRequestDto.phoneNumber;
    helpRequest.deliveryComment = createRequestDto.deliveryComment;
    helpRequest.city = createRequestDto.city;
    helpRequest.street = createRequestDto.street;
    helpRequest.number = createRequestDto.number;
    helpRequest.firstName = createRequestDto.firstName;
    helpRequest.lastName = createRequestDto.lastName;
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
    const relations = ['articles', 'articles.article', 'call'];

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
    return this.helpRequestRepository.find({
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
      if (helpRequestArticleDto.articleCount) {
        oldArticle.articleCount = helpRequestArticleDto.articleCount;
      }
      if (typeof helpRequestArticleDto.articleDone === 'boolean') {
        oldArticle.articleDone = helpRequestArticleDto.articleDone;
      }
      if (typeof helpRequestArticleDto.unitId) {
        oldArticle.unitId = helpRequestArticleDto.unitId;
      }
    } else {
      const newArticle = new HelpRequestArticle();
      newArticle.articleId = articleId;
      newArticle.articleCount = helpRequestArticleDto.articleCount;
      if (typeof helpRequestArticleDto.articleDone === 'boolean') {
        newArticle.articleDone = helpRequestArticleDto.articleDone;
      }
      if (typeof helpRequestArticleDto.unitId) {
        newArticle.unitId = helpRequestArticleDto.unitId;
      }
      helpRequest.articles.push(newArticle);
    }
    return this.helpRequestRepository.save(helpRequest);
  }

  async removeArticle(helpRequest: HelpRequest, articleId: number) {
    const index = helpRequest.articles.findIndex(
      art => art.articleId == articleId,
    );
    if (index > -1) {
      helpRequest.articles.splice(index, 1);
    }
    return this.helpRequestRepository.save(helpRequest);
  }

  async update(requestId: number, requestEntity: HelpRequestCreateDto) {
    const request = await this.findRequest(requestId);
    await this.populateRequest(request, requestEntity);

    return this.helpRequestRepository.save(request);
  }

  private async findRequest(id: number) {
    const request: HelpRequest | undefined = await this.getById(id);
    if (!request) {
      throw new NotFoundException('This request does not exist');
    }
    return request;
  }
}
