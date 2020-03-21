import { Entity, Repository } from 'typeorm';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { Roles } from 'modules/common/decorators/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Helper } from './helper.entity';
import { UserFillableFields, User } from 'modules/user/user.entity';

@Injectable()
@Roles('admin')
export class HelpersService {
  constructor(
    @InjectRepository(Helper)
    private readonly helperRepository: Repository<Helper>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async get(id: number) {
    return this.helperRepository.findOne(id);
  }

  async getByEmail(email: string) {
    return await this.helperRepository.findOne({
      where: {
        user: {
          email,
        },
      },
    });
  }

  async getByEmailAndPass(email: string, password: string) {
    return await this.helperRepository.findOne({
      where: {
        user: {
          email,
          password,
        },
      },
    });
  }

  async create(payload: UserFillableFields) {
    const checkUserExistence = this.helperRepository.findOne({
      where: {
        email: payload.email,
      },
    });

    if (checkUserExistence) {
      throw new NotAcceptableException(
        'Another user with provided email already exists.',
      );
    }

    const user = this.userRepository.create(payload);
    const newSeeker = this.helperRepository.create({ user });

    return await this.helperRepository.save(newSeeker);
  }
}
