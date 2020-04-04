import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { closeConnections, prepareApp, prepareConnection } from './e2e.helpers';
import supertest = require('supertest');

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const url = '/';

  beforeAll(async done => {
    app = await prepareApp();
    done();
  });

  beforeEach(async done => {
    await prepareConnection();
    done();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Content Negotiation', () => {
    it('should always respond with Content-Type: "application/json"', async done => {
      /**
       * The Middleware intercepts all responses and adds the Content-Type Header
       * Check this once is accordingly enough
       */
      const result: any = await supertest(app.getHttpServer()).get(
        url + '/articles',
      );

      expect(result.header['content-type']).toContain('application/json');
      done();
    });

    it('should not allow Content-Type parameters', async done => {
      const result: any = await supertest(app.getHttpServer())
        .post(url + '/devices')
        .set('Content-Type', 'application/json; someParameter=test');

      expect(result.status).toBe(HttpStatus.UNSUPPORTED_MEDIA_TYPE);
      expect(result.body.errors[0].status).toBe(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE.toString(),
      );
      expect(result.body.errors[0].title).toBe('Unsupported Media Type');
      expect(result.body.errors[0].detail).toBe(
        'Content-Type parameters are not allowed!',
      );

      done();
    });
  });

  afterAll(async done => {
    await closeConnections();
    done();
  });
});
