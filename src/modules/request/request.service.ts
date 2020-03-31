import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Roles } from '../common/decorators/roles.decorator';
import { RequestEntity } from './request.entity';
import { RequestFormDto } from './dto/request-form.dto';
import { RequestArticle } from './requestArticle.entity';
import { RequestArticleStatusDto } from '../shoppingList/dto/shopping-list-form.dto';

@Injectable()
@Roles('user')
export class RequestService {
  static LOGGER = new Logger('Request', true);

  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
  ) {}

  async get(id: number) {
    return this.requestRepository.findOne(id, { relations: ['articles'] });
  }

  async create(createRequestDto: RequestFormDto, user: any) {
    const request = new RequestEntity();
    this.populateRequest(request, createRequestDto);
    request.requesterId = user.userId;

    return this.requestRepository.save(request);
  }

  private populateRequest(
    request: RequestEntity,
    createRequestDto: RequestFormDto,
  ) {
    request.articles = [];
    if (createRequestDto.articles) {
      createRequestDto.articles.forEach(art => {
        const newArticle = new RequestArticle();
        newArticle.articleId = art.articleId;
        newArticle.articleCount = art.articleCount;
        newArticle.articleDone = false;
        request.articles.push(newArticle);
      });
    }
    request.additionalRequest = createRequestDto.additionalRequest;
    request.phoneNumber = createRequestDto.phoneNumber;
    request.deliveryComment = createRequestDto.deliveryComment;
    request.city = createRequestDto.city;
    request.street = createRequestDto.street;
    request.number = createRequestDto.number;
    request.zipCode = createRequestDto.zipCode;
  }

  async getAll(user: any, onlyMine: string, zipCode: string) {
    const conditions: any = {};
    if (onlyMine === 'true') {
      conditions.requesterId = user.userId;
    }
    if (zipCode) {
      conditions.zipCode = zipCode;
    }
    return await this.requestRepository.find({
      where: conditions,
      relations: ['articles'],
    });
  }

  async updateRequestArticle(
    requestId: number,
    articleId: number,
    articleStatusDto: RequestArticleStatusDto,
  ) {
    const request: RequestEntity = await this.findRequest(requestId);
    const article = request.articles.find(
      v => v.articleId === Number(articleId),
    );
    if (!article) {
      throw new BadRequestException(
        'This article does not exist in the request',
      );
    }
    article.articleDone = articleStatusDto.articleDone;
    return await this.requestRepository.save(request);
  }

  async update(requestId: number, requestEntity: RequestFormDto) {
    const request: RequestEntity = await this.findRequest(requestId);
    this.populateRequest(request, requestEntity);

    return await this.requestRepository.save(request);
  }

  private async findRequest(id: number) {
    const request: RequestEntity | undefined = await this.get(id);
    if (!request) {
      throw new NotFoundException('This request does not exist');
    }
    return request;
  }
}
