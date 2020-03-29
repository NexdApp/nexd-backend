import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Roles } from '../../decorators/roles.decorator';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
@Roles('admin')
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getById(userId: string) {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getByEmail(email: string) {
    return await this.userRepository.findOne({ email });
  }

  async getByEmailAndPass(email: string, password: string) {
    return await this.userRepository.findOne({ email, password });
  }

  async create(payload: RegisterDto) {
    const checkUserExistence = await this.getByEmail(payload.email);

    if (checkUserExistence) {
      throw new NotAcceptableException(
        'Another user with provided email already exists.',
      );
    }

    const newUser = this.userRepository.create(payload);
    return await this.userRepository.save(newUser);
  }

  async update(editRequestDto: UpdateUserDto, user: User) {
    user.city = editRequestDto.city;
    user.street = editRequestDto.street;
    user.number = editRequestDto.number;
    user.zipCode = editRequestDto.zipCode;
    user.firstName = editRequestDto.firstName;
    user.lastName = editRequestDto.lastName;
    user.role = editRequestDto.role;
    user.telephone = editRequestDto.telephone;

    return await this.userRepository.save(user);
  }

  async getAll() {
    return await this.userRepository.find();
  }
}
