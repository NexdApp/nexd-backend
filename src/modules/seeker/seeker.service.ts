import { Injectable, NotAcceptableException } from '@nestjs/common';
import { Roles } from 'modules/common/decorators/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeker } from './seeker.entity';
import { Repository } from 'typeorm';
import { string } from 'joi';
import { UserFillableFields, User } from 'modules/user/user.entity';

@Injectable()
@Roles('admin')
export class SeekersService {
  constructor(
    @InjectRepository(Seeker)
    private readonly seekerRepository: Repository<Seeker>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async get(id: number) {
    return this.seekerRepository.findOne(id);
  }

  async getByEmail(email: string) {
    return await this.seekerRepository.findOne({
      where: {
        user: {
          email,
        },
      },
    });
  }

  async getByEmailAndPass(email: string, password: string) {
    return await this.seekerRepository.findOne({
      where: {
        user: {
          email,
          password,
        },
      },
    });
  }

  async create(payload: UserFillableFields) {
    const checkUserExistence = await this.userRepository.findOne({
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
    const newSeeker = this.seekerRepository.create({ user });

    return await this.seekerRepository.save(newSeeker);
  }
}
