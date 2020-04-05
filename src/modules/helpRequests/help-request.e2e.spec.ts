import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigurationService } from '../../configuration/configuration.service';
import { HelpRequestsController } from './help-requests.controller';
import { HelpRequestStatus } from './help-request-status';
import { HelpRequestsService } from './help-requests.service';
import { HelpRequest } from './help-request.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { mockUserService } from '../../../test/test.helpers';
import { JwtService } from '@nestjs/jwt';

describe('HelpRequest Controller', () => {
  let app: INestApplication;
  let controller: HelpRequestsController;
  let jwtService: JwtService;

  const helpRequest = [{
    id: 1,
    'street': 'string',
    'number': 'string',
    'zipCode': 'string',
    'city': 'string',
    'articles': [
      {
        id: 1,
        'articleId': 1,
        'articleCount': 1,
        articleDone: false,
      },
    ],
    'status': HelpRequestStatus.PENDING,
    'additionalRequest': 'string',
    'deliveryComment': 'string',
    'phoneNumber': 'string',
  }];

  const helpRequestCount = 1;
  const getAllResult = helpRequest;
  // Mock data for service
  const helpRequestService = { getAll: () => getAllResult };
  const configurationService = {
    isDev: () => true,
    APIPort: () => 0,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        HelpRequestsService,
        UsersService,
        ConfigurationService,
        {
          provide: getRepositoryToken(HelpRequest),
          useValue: helpRequestService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserService,
        },
      ],
      controllers: [HelpRequestsController],
    })
      .overrideProvider(ConfigurationService).useValue(configurationService)
      .overrideProvider(HelpRequestsService).useValue(helpRequestService)
      .overrideProvider(UsersService).useValue(mockUserService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    controller = moduleFixture.get<HelpRequestsController>(HelpRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it(`/GET help-requests`, () => {
    return request(app.getHttpServer())
      .get('/help-requests')
      .expect(200)
      .expect(
        helpRequestService.getAll(),
      );
  });

  afterAll(async () => {
    await app.close();
  });
});
