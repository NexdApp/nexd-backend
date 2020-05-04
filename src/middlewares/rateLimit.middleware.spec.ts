import * as rateLimit from 'express-rate-limit';
import {
  DefaultRateLimitMiddleware,
  AuthRateLimitMiddleware,
} from './rateLimit.middleware';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

jest.mock('express-rate-limit', () => jest.fn());

const rateLimitMiddleware = jest.fn();
beforeEach(() => {
  jest.resetAllMocks();
  rateLimitMiddleware.mockReset();
  (rateLimit as jest.Mock).mockReturnValue(rateLimitMiddleware);
});

const getFakeMiddlewareParams = () => ({
  request: {
    url: 'some url',
  } as Request,
  response: {
    statusCode: 200,
  } as Response,
  next: jest.fn() as NextFunction,
});

it('should configure default rate limiter', () => {
  const { request, response, next } = getFakeMiddlewareParams();
  const rateLimiter = new DefaultRateLimitMiddleware({
    get: (_key: string) => undefined,
  } as ConfigService);

  rateLimiter.use(request, response, next);

  expect(rateLimit).toHaveBeenCalledWith({
    max: 1000,
    windowMs: 900000,
  });
  expect(rateLimitMiddleware).toHaveBeenCalledWith(request, response, next);
});

it('should configure a default rate limiter based on environment variables', () => {
  const { request, response, next } = getFakeMiddlewareParams();
  const rateLimiter = new DefaultRateLimitMiddleware({
    get: (key: string) =>
      ({
        DEFAULT_RATE_LIMIT_MINUTES: 1,
        DEFAULT_RATE_LIMIT_MAX_REQUESTS: 1,
      }[key]),
  } as ConfigService);

  rateLimiter.use(request, response, next);

  expect(rateLimit).toHaveBeenCalledWith({
    max: 1,
    windowMs: 60000,
  });
  expect(rateLimitMiddleware).toHaveBeenCalledWith(request, response, next);
});

it('should configure auth rate limiter', () => {
  const { request, response, next } = getFakeMiddlewareParams();
  const rateLimiter = new AuthRateLimitMiddleware({
    get: (_key: string) => undefined,
  } as ConfigService);

  rateLimiter.use(request, response, next);

  expect(rateLimit).toHaveBeenCalledWith({
    max: 50,
    windowMs: 1800000,
  });
  expect(rateLimitMiddleware).toHaveBeenCalledWith(request, response, next);
});

it('should configure a auth rate limiter based on environment variables', () => {
  const { request, response, next } = getFakeMiddlewareParams();
  const rateLimiter = new DefaultRateLimitMiddleware({
    get: (key: string) =>
      ({
        DEFAULT_RATE_LIMIT_MINUTES: 1,
        DEFAULT_RATE_LIMIT_MAX_REQUESTS: 1,
      }[key]),
  } as ConfigService);

  rateLimiter.use(request, response, next);

  expect(rateLimit).toHaveBeenCalledWith({
    max: 1,
    windowMs: 60000,
  });
  expect(rateLimitMiddleware).toHaveBeenCalledWith(request, response, next);
});
