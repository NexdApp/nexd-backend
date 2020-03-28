import { createParamDecorator } from '@nestjs/common';
import { User } from '../modules/users/user.entity';

export interface IRequestUser extends Request {
  user?: User;
}

export const ReqUser = createParamDecorator((data, req: IRequestUser) => {
  return req.user;
});
