import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {Roles} from '../common/decorators/roles.decorator';
import {Request} from './request.entity';
import {CreateRequestDto} from './dto/create-request.dto';
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

  async create(createRequestDto: CreateRequestDto, user: any) {
    const request = new Request();
    request.articles = [];
    createRequestDto.articles.forEach(art => {
      const newArticle = new RequestArticle();
      newArticle.articleId = art.articleId;
      newArticle.articleCount = art.articleCount;
      newArticle.articleDone = false;
      request.articles.push(newArticle);
    });
    request.requester = user.userId;
    request.additionalRequest = createRequestDto.additionalRequest;
    request.address = createRequestDto.address;
    request.zipCode = createRequestDto.zipCode;
    request.city = createRequestDto.city;
    request.phoneNumber = createRequestDto.phoneNumber;
    request.deliveryComment = createRequestDto.deliveryComment;

    return this.requestRepository.save(request);
  }

  async getAll(user: any, onlyMine: string) {
    let where = {};
    if (onlyMine === 'true') {
      where = { where: { requester: user.userId } };
    }
    return await this.requestRepository.find({...where,relations: ['articles'],
    });
  }

  async updateRequestArticle(requestId: number, articleId: number, articleStatusDto: RequestArticleStatusDto) {
    const request: Request | undefined = await this.get(requestId);
    if (!request) {
      throw new NotFoundException('This request does not exist');
    }
    const article = request.articles.find((v) => v.articleId === Number(articleId));
    if (!article) {
      throw new BadRequestException('This article does not exist in the request');
    }
    article.articleDone = articleStatusDto.articleDone;
    return this.requestRepository.save(request);
  }
}
