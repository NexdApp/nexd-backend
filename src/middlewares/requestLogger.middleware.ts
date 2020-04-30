import { RequestHandler } from 'express';
import { parse } from 'url';

export const requestLoggerMiddleware: (
  isDev: boolean,
) => RequestHandler = isDev => (request, _response, next) => {
  if (isDev) {
    const { method } = request;
    const date = new Date(Date.now()).toJSON();
    const time = date.replace('T', ' ').slice(0, -5);
    const route = parse(request.url).path;
    console.log(`${time} ~ ${method} ${route || '/'}`); // tslint:disable-line no-console
  }

  next();
};
