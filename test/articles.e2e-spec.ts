import { HttpStatus, Logger } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import * as supertest from 'supertest';
import { closeConnections, prepareApp } from './e2e.helpers';

describe('Articles E2E', () => {
  let app: NestApplication;
  const standardUrl = '/articles';

  beforeAll(async done => {
    app = await prepareApp();
    done();
  });

  describe('GET all', () => {
    it('should return all articles', async done => {
      const result = await supertest(app.getHttpServer()).get(standardUrl);

      Logger.log(result.body);
      expect(result.body.data.length).toBeGreaterThan(0);
      done();
    });
  });

  describe('POST /article', () => {
    it('should return an error if article.name is not string', async done => {
      const wrongArticle = 2;

      const result: any = await supertest(app.getHttpServer())
        .post(standardUrl)
        .set('Content-Type', 'application/json')
        .send({
          name: wrongArticle,
        });

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.body).toHaveProperty('errors');
      expect(Array.isArray(result.body.errors)).toBe(true);
      expect(result.body.errors.length).toBe(1);

      const firstError = result.body.errors[0];
      expect(firstError.status).toBe(HttpStatus.BAD_REQUEST.toString());
      expect(firstError.title).toBe('isString');
      done();
    });

    it('should return 409 error if the tenant already exists', async done => {
      // Arrange
      let article = 'Milk (1L)';

      const preResult: any = await supertest(app.getHttpServer())
        .post(standardUrl)
        .set('Content-Type', 'application/json')
        .send({
          data: {
            name: article,
          },
        });

      expect(preResult.status).toBe(HttpStatus.CREATED);

      // Act
      const result: any = await supertest(app.getHttpServer())
        .post(standardUrl)
        .set('Content-Type', 'application/json')
        .send({
          data: {
            name: article,
          },
        });

      expect(result.status).toBe(HttpStatus.CONFLICT);
      expect(result.body).toHaveProperty('errors');
      expect(Array.isArray(result.body.errors)).toBe(true);
      expect(result.body.errors.length).toBe(1);

      const firstError = result.body.errors[0];
      expect(firstError.status).toBe(HttpStatus.CONFLICT.toString());
      expect(firstError.title).toBe('Entity already exists');
      done();
    });

    it('should create the tenant', async done => {
      let article = 'testArticle';

      const result: any = await supertest(app.getHttpServer())
        .post(standardUrl)
        .set('Content-Type', 'application/json')
        .send({
          name: article,
        });

      expect(result.status).toBe(HttpStatus.CREATED);
      expect(result.body).toHaveProperty('data');
      done();
    });
  });

  afterAll(async done => {
    await closeConnections();
    done();
  });
});
