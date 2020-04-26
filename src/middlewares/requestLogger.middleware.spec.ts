import { Request, Response, NextFunction } from 'express';
import { requestLoggerMiddleware } from './requestLogger.middleware';

const createRequestParams = () => ({
  request: {
    method: 'METHOD',
    url: '/some-url',
  } as Request,
  response: {} as Response,
  next: (jest.fn() as any) as NextFunction,
});

let log: jest.SpyInstance;
let now: jest.SpyInstance;
beforeEach(() => {
  log = jest.spyOn(console, 'log').mockImplementation();
  now = jest
    .spyOn(global.Date, 'now')
    .mockImplementation(() => new Date('2020-01-01T00:00:00.000Z').valueOf());
});

it('should log request when dev mode', () => {
  const { response, request, next } = createRequestParams();
  requestLoggerMiddleware(true)(request, response, next);

  expect(log).toHaveBeenCalledWith('2020-01-01 00:00:00 ~ METHOD /some-url');

  expect(next).toHaveBeenCalled();
});

it('should not log the request when not in dev mode', () => {
  const { response, request, next } = createRequestParams();
  requestLoggerMiddleware(false)(request, response, next);

  expect(log).not.toHaveBeenCalled();

  expect(next).toHaveBeenCalled();
});

afterEach(() => {
  log.mockRestore();
  now.mockRestore();
});
