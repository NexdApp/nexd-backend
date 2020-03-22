import {Body, Controller, Logger, Post} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {AuthService} from './auth.service';
import {LoginPayload} from './login.payload';
import {RegisterPayload} from './register.payload';
import {UsersService} from '../user/user.service';
import {ResponseTokenDto} from './dto/response-token.dt';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  static LOGGER = new Logger('Auth', true);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
  }

  @Post('login')
  @ApiOkResponse({
    description: 'Successful Login',
    type: ResponseTokenDto,
  })
  @ApiBadRequestResponse({description: 'Bad Request'})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  async login(@Body() credentials: LoginPayload): Promise<any> {
    const user = await this.authService.validateUser(credentials);
    return await this.authService.generateToken(user);
  }

  @Post('register')
  @ApiCreatedResponse({
    description: 'Successful Registration',
    type: ResponseTokenDto,
  })
  @ApiBadRequestResponse({description: 'Bad Request'})
  @ApiNotAcceptableResponse({description: 'Already exists'})
  async register(@Body() payload: RegisterPayload): Promise<any> {
    const user = await this.userService.create(payload);
    AuthController.LOGGER.log(user);
    return await this.authService.generateToken(user);
  }
}
