import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

import { UsersService } from './users.service';

const uuid = {
  3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
};

@Injectable()
export class UserIdValidationPipe implements PipeTransform<string> {
  constructor(private readonly usersService: UsersService) {}

  transform(value: string, metadata: ArgumentMetadata) {
    const valid = this.isUUID(value) || value === 'me';
    if (!valid) {
      throw new BadRequestException(
        'Validation failed (userId is UUID or "me")',
      );
    }
    return value;
  }

  private isUUID(str: any, version = 'all') {
    if (typeof str !== 'string') {
      return false;
    }
    const pattern = uuid[version];
    return pattern && pattern.test(str);
  }
}
