import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {Roles} from '../common/decorators/roles.decorator';
import {Request, RequestFillableFields} from './request.entity';

@Injectable()
@Roles('user') // TODO: Add 'authenticatedUser'
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {
  }

  async get(id: number) {
    return this.requestRepository.findOne(id);
  }

  async create(payload: RequestFillableFields) {
    const newRequest = this.requestRepository.create(payload);
    return await this.requestRepository.save(newRequest);
  }

  async getAll() {
    return await this.requestRepository.find();
  }
}
