import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Article } from './article.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigurationService } from '../../configuration/configuration.service';

describe('Articles Controller', () => {
  let app: INestApplication;
  let controller: ArticlesController;

  const articles = [{ id: 1, name: 'test' }];

  const articlesCount = 1;
  const getAllResult = articles;
  // Mock data for service
  const articlesService = { findAll: () => getAllResult };
  const configurationService = {
    isDev: () => true,
    APIPort: () => 0,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        ConfigurationService,
        {
          provide: getRepositoryToken(Article),
          useValue: articlesService,
        },
      ],
      controllers: [ArticlesController],
    })
      .overrideProvider(ConfigurationService)
      .useValue(configurationService)
      .overrideProvider(ArticlesService)
      .useValue(articlesService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    controller = moduleFixture.get<ArticlesController>(ArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it(`/GET articles`, () => {
    return request(app.getHttpServer())
      .get('/articles')
      .expect(200)
      .expect(
        articlesService.findAll(),
      );
  });

  afterAll(async () => {
    await app.close();
  });

  afterAll(async () => {
    await app.close();
  });
});
