import {Injectable, NotAcceptableException, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {Roles} from '../common/decorators/roles.decorator';
import {User, UserFillableFields} from './user.entity';
import {UpdateUserDto} from './dto/update-user.dto';

@Injectable()
@Roles('admin') // TODO: Add 'authenticatedUser'
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  async get(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getByEmail(email: string) {
    return await this.userRepository.findOne({email});
    // return await this.userRepository
    //   .createQueryBuilder('users')
    //   .where('users.email = :email')
    //   .setParameter('email', email)
    //   .getOne();
  }

  async getByEmailAndPass(email: string, password: string) {
    // const passHash = createHmac('sha256', password).digest('hex');
    return await this.userRepository.findOne({email, password});
    // return await this.userRepository
    //   .createQueryBuilder('users')
    //   .where('users.email = :email and users.password = :password')
    //   .setParameter('email', email)
    //   .setParameter('password', passHash)
    //   .getOne();
  }

  async create(payload: UserFillableFields) {
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
    user.address = editRequestDto.address;
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
