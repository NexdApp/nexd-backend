import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Roles } from '../common/decorators/roles.decorator';
import { Request } from './request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { User } from 'modules/user/user.entity';
import { RequestArticle } from './requestArticle.entity';

@Injectable()
@Roles('user') // TODO: Add 'authenticatedUser'
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  async get(id: number) {
    return this.requestRepository.findOne(id);
  }

  async create(createRequestDto: CreateRequestDto, user: any) {
    const request = new Request();
    createRequestDto.articles.forEach(art => {
      const newArticle = new RequestArticle();
      newArticle.articleId = art.articleId;
      newArticle.articleCount = art.articleCount;
      request.articles?.push(newArticle);
    });
    request.requester = user.userId;

    return this.requestRepository.save(request);
  }

  async getAll() {
    return await this.requestRepository.find();
  }
}
