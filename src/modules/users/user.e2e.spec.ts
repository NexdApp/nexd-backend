import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { AppModule } from '../../app.module';
import { TokenDto } from '../auth/dto/token.dto';

xdescribe('Users (e2e)', () => {
  let app: INestApplication;
  let user1Login: TokenDto;
  let user2Login: TokenDto;
  let usersService: UsersService;
  let configService: ConfigService;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    usersService = moduleFixture.get<UsersService>(UsersService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
    authService = moduleFixture.get<AuthService>(AuthService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await usersService.create({
      firstName: 'user1',
      lastName: 'Test',
      email: 'user1@email.com',
      password: 'password1',
    });

    await usersService.create({
      firstName: 'user2',
      lastName: 'Test',
      email: 'user2@email.com',
      password: 'password2',
    });

    let result = await authService.validateUserByEmail('user1@email.com', 'password1');
    if (result) user1Login = result;

    result = await authService.validateUserByEmail('user2@email.com', 'password2');
    if (result) user2Login = result;
  });

  describe('login', () => {
    it('works', () => {
      const data = {
        email: 'user1@email.com',
        pass: 'password1',
      };
      return request(app.getHttpServer())
        .post('/login')
        .send(data)
        .expect(200)
        .expect(response => {
          console.log(response);
          expect(response.body.data.login.user).toMatchObject({
            firstName: 'user1',
          });
        });
    });

    it('fails password', () => {
      const data = {
        query: `{login(user:{username:"user1",password:"pAssword1"}){token user{username}}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .send(data)
        .expect(200)
        .expect(response => {
          expect(response.body.errors[0].extensions.code).toEqual(
            'UNAUTHENTICATED',
          );
        });
    });

    it('fails email', () => {
      const data = {
        query: `{login(user:{username:"notAUser",password:"password1"}){token user{username}}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .send(data)
        .expect(200)
        .expect(response => {
          expect(response.body).toHaveProperty('errors');
          expect(response.body.errors[0].extensions.code).toEqual(
            'UNAUTHENTICATED',
          );
        });
    });
  });

  describe('get user info', () => {
    it('works with username', () => {
      const data = {
        query: `{user(username:"uSer1"){username}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .set('Authorization', `Bearer ${user1Login.access_token}`)
        .send(data)
        .expect(200)
        .expect(response => {
          expect(response.body.data.user).toMatchObject({
            username: 'user1',
          });
        });
    });

    it('works with email', () => {
      const data = {
        query: `{user(email:"uSer1@email.com"){username}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .set('Authorization', `Bearer ${user1Login.access_token}`)
        .send(data)
        .expect(200)
        .expect(response => {
          expect(response.body.data.user).toMatchObject({
            firstName: 'user1',
          });
        });
    });

    it('fails with wrong username', () => {
      const data = {
        query: `{user(username:"user10"){username}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .set('Authorization', `Bearer ${user1Login.access_token}`)
        .send(data)
        .expect(200)
        .expect(response => {
          expect(response.body.errors[0].extensions.code).toEqual(
            'UNAUTHENTICATED',
          );
        });
    });

    it('fails with wrong token', () => {
      const data = {
        query: `{user(username:"user2"){username}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .set('Authorization', `Bearer ${user1Login.access_token}`)
        .send(data)
        .expect(200)
        .expect(response => {
          expect(response.body.errors[0].extensions.code).toEqual(
            'UNAUTHENTICATED',
          );
        });
    });

    it('fails with no token', () => {
      const data = {
        query: `{user(username:"user10"){username}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .send(data)
        .expect(200)
        .expect(response => {
          expect(response.body.errors[0].extensions.code).toEqual(
            'UNAUTHENTICATED',
          );
        });
    });

    it('fails with mispelled token', () => {
      const data = {
        query: `{user(username:"user10"){username}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .set('Authorization', `Bearer ${user1Login.access_token}a`)
        .send(data)
        .expect(200)
        .expect(response => {
          expect(response.body.errors[0].extensions.code).toEqual(
            'UNAUTHENTICATED',
          );
        });
    });
  });

  describe('get users', () => {
    it('works with admin', () => {
      const data = {
        query: `{users{username}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .set('Authorization', `Bearer ${user1Login.access_token}`)
        .send(data)
        .expect(200)
        .expect(response => {
          expect(response.body.data.users).toContainEqual({
            username: 'user1',
          });
          expect(response.body.data.users).toContainEqual({
            username: 'user2',
          });
          expect(response.body.data.users).toContainEqual({
            username: 'admin',
          });
          expect(response.body.data.users).toContainEqual({
            username: 'disabledUser',
          });
          expect(response.body.data.users).toContainEqual({
            username: 'disabledAdmin',
          });
        });
    });

    it('fails with no token', () => {
      const data = {
        query: `{users{username}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .send(data)
        .expect(200)
        .expect(response => {
          expect(response.body.errors[0].extensions.code).toEqual(
            'UNAUTHENTICATED',
          );
        });
    });
  });

  describe('register user', () => {
    it('works', () => {
      const data = {
        query: `mutation {
          createUser(createUserInput: {
            username: "user3",
            email:"user3@email.com",
            password:"password"
          }) {username}}`,
      };
      return request(app.getHttpServer())
        .post('/register')
        .send(data)
        .expect(200)
        .expect(response => {
          expect(response.body.data.createUser).toMatchObject({
            username: 'user3',
          });
        });
    });

    it('fails for duplicate username', () => {
      const data = {
        query: `mutation {
          createUser(createUserInput: {
            username: "usEr2",
            email:"user4@email.com",
            password:"password"
          }) {username}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .send(data)
        .expect(200)
        .expect(response => {
          expect(response.body.errors[0].extensions.code).toEqual(
            'BAD_USER_INPUT',
          );
        });
    });

    it('fails for duplicate email', () => {
      const data = {
        query: `mutation {
          createUser(createUserInput: {
            username: "user4",
            email:"user2@emAil.com",
            password:"password"
          }) {username}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .send(data)
        .expect(200)
        .expect(response => {
          expect(response.body.errors[0].extensions.code).toEqual(
            'BAD_USER_INPUT',
          );
        });
    });

    it('fails for no username', () => {
      const data = {
        query: `mutation {
          createUser(createUserInput: {
            email:"user5@email.com",
            password:"password"
          }) {username}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .send(data)
        .expect(400)
        .expect(response => {
          expect(response.body.errors[0].extensions.code).toEqual(
            'LOGIN_VALIDATION_FAILED',
          );
        });
    });

    it('fails for no password', () => {
      const data = {
        query: `mutation {
          createUser(createUserInput: {
            username: "user5",
            email:"user5@email.com"
          }) {username}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .send(data)
        .expect(400)
        .expect(response => {
          expect(response.body.errors[0].extensions.code).toEqual(
            'LOGIN_VALIDATION_FAILED',
          );
        });
    });

    it('fails for no email', () => {
      const data = {
        query: `mutation {
          createUser(createUserInput: {
            username: "user5",
            password:"password"
          }) {username}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .send(data)
        .expect(400)
        .expect(response => {
          expect(response.body.errors[0].extensions.code).toEqual(
            'LOGIN_VALIDATION_FAILED',
          );
        });
    });

    it('fails for bad email, no @', () => {
      const data = {
        query: `mutation {
          createUser(createUserInput: {
            username: "user5",
            password: "password",
            email: "email.com"
          }) {username}}`,
      };
      return request(app.getHttpServer())
        .post('/login')
        .send(data)
        .expect(200)
        .expect(response => {
          expect(response.body.errors[0].extensions.code).toEqual(
            'BAD_USER_INPUT',
          );
        });
    });
  });

  afterAll(() => {
    app.close();
  });
});
