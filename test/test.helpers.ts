import { UsersService } from '../src/modules/users/users.service';
import { User } from '../src/modules/users/user.entity';
import { Repository } from 'typeorm';

const userRepository: Repository<User> = new Repository<User>();

export const testUser = {
  firstName: 'Test',
  lastName: 'Test',
  email: 'test@test.com',
  password: 'securePw',
};
// userRepository.create(testUser);

export const mockUserService = {
  getById: id => ({ id, ...testUser }),
};
export const newUserService: UsersService = new UsersService(userRepository);
