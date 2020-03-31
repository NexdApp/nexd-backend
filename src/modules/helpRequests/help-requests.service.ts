import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HelpRequest } from './help-request.entity';
import { HelpRequestCreateDto } from './dto/help-request-create.dto';
import { HelpRequestArticle } from './help-request-article.entity';
// import { HelpRequestArticleStatusDto } from '../helpList/dto/shopping-list-form.dto';

@Injectable()
export class HelpRequestsService {
  static LOGGER = new Logger('Request', true);

  constructor(
    @InjectRepository(HelpRequest)
    private readonly helpRequestRepository: Repository<HelpRequest>,
  ) {}

  async get(id: number) {
    return this.helpRequestRepository.findOne(id, { relations: ['articles'] });
  }

  async create(createRequestDto: HelpRequestCreateDto, userId: string) {
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
        // newArticle.article = new Article().id = art.articleId;
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

  async getAll(user: any, onlyMine: string, zipCode: string) {
    const conditions: any = {};
    if (onlyMine === 'true') {
      conditions.requester = user.userId;
    }
    if (zipCode) {
      conditions.zipCode = zipCode;
    }
    return await this.helpRequestRepository.find({
      where: conditions,
      relations: ['articles'],
    });
  }

  // async updateHelpRequestArticle(
  //   requestId: number,
  //   articleId: number,
  //   articleStatusDto: HelpRequestArticleStatusDto,
  // ) {
  //   const request: HelpRequest = await this.findRequest(requestId);
  //   const article = request.articles.find(
  //     v => v.articleId === Number(articleId),
  //   );
  //   if (!article) {
  //     throw new BadRequestException(
  //       'This article does not exist in the request',
  //     );
  //   }
  //   article.articleDone = articleStatusDto.articleDone;
  //   return await this.helpRequestRepository.save(request);
  // }

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
