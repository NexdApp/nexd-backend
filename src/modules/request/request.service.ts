import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {Roles} from '../common/decorators/roles.decorator';
import {Request} from './request.entity';
import {RequestFormDto} from './dto/request-form.dto';
import {RequestArticle} from './requestArticle.entity';
import {RequestArticleStatusDto} from '../shoppingList/dto/shopping-list-form.dto';

@Injectable()
@Roles('user')
export class RequestService {
  static LOGGER = new Logger('Request', true);

  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {
  }

  async get(id: number) {
    return this.requestRepository.findOne(id, {relations: ['articles']});
  }

  async create(createRequestDto: RequestFormDto, user: any) {
    const request = new Request();
    this.populateRequest(request, createRequestDto);
    request.requester = user.userId;

    return this.requestRepository.save(request);
  }

  private populateRequest(request: Request, createRequestDto: RequestFormDto) {
    request.articles = [];
    createRequestDto.articles.forEach(art => {
      const newArticle = new RequestArticle();
      newArticle.articleId = art.articleId;
      newArticle.articleCount = art.articleCount;
      newArticle.articleDone = false;
      request.articles.push(newArticle);
    });
    request.additionalRequest = createRequestDto.additionalRequest;
    request.address = createRequestDto.address;
    request.zipCode = createRequestDto.zipCode;
    request.city = createRequestDto.city;
    request.phoneNumber = createRequestDto.phoneNumber;
    request.deliveryComment = createRequestDto.deliveryComment;
  }

  async getAll(user: any, onlyMine: string) {
    let where = {};
    if (onlyMine === 'true') {
      where = {where: {requester: user.userId}};
    }
    return await this.requestRepository.find({
      ...where, relations: ['articles'],
    });
  }

  async updateRequestArticle(requestId: number, articleId: number, articleStatusDto: RequestArticleStatusDto) {
    const request: Request = await this.findRequest(requestId);
    const article = request.articles.find((v) => v.articleId === Number(articleId));
    if (!article) {
      throw new BadRequestException('This article does not exist in the request');
    }
    article.articleDone = articleStatusDto.articleDone;
    return await this.requestRepository.save(request);
  }

  async update(requestId: number, requestEntity: RequestFormDto) {
    const request: Request = await this.findRequest(requestId);
    this.populateRequest(request, requestEntity);

    return await this.requestRepository.save(request);
  }

  private async findRequest(id: number) {
    const request: Request | undefined = await this.get(id);
    if (!request) {
      throw new NotFoundException('This request does not exist');
    }
    return request;
  }
}
