import { Repository } from 'typeorm';
import { HelpRequestsService } from './help-requests.service';
import { HelpRequestsController } from './help-requests.controller';
import { HelpRequest } from './help-request.entity';
import { UsersService } from '../users/users.service';
import { newUserService, testUser } from '../../../test/test.helpers';
import { HelpRequestStatus } from './help-request-status';
import { HelpRequestArticle } from './help-request-article.entity';

describe('HelpRequest Controller', () => {
  let service: HelpRequestsService;
  const userService: UsersService = newUserService;
  let controller: HelpRequestsController;
  let repository: Repository<HelpRequest>;

  beforeEach(async () => {
    service = new HelpRequestsService(repository);
    controller = new HelpRequestsController(service, userService);
  });

  describe('findAll', () => {
    it('should return an array of help requests', async () => {
      const user = testUser;
      const result = [{ id: 1, name: 'test' }];
      jest.spyOn(service, 'getAll').mockResolvedValue(result);

      expect(
        await controller.getAll(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          user,
        ),
      ).toBe(result);
    });
  });

  xdescribe('create', () => {
    it('should create a new request', async () => {
      const user = testUser;
      const request = {
        street: 'string',
        number: 'string',
        zipCode: 'string',
        city: 'string',
        articles: [
          {
            articleId: 1,
            articleCount: 1,
          },
        ],
        status: 'pending',
        additionalRequest: 'string',
        deliveryComment: 'string',
        phoneNumber: 'string',
      };
      const result = {
        id: 1,
        created_at: new Date(),
        ...request,
        status: HelpRequestStatus.PENDING,
        articles: request.articles.map(v => new HelpRequestArticle()),
      };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(
        await controller.getAll('1', 'false', ['a'], 'true', ['pending'], user),
      ).toBe(result);
    });
  });
});
