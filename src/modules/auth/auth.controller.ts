import {
  Controller,
  Request,
  Post,
  UseGuards,
  Logger,
  Body,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({
    description: 'Successful Registration',
    type: User,
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiCreatedResponse({
    description: 'Successful Registration',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotAcceptableResponse({ description: 'Already exists' })
  async register(@Body() payload: RegisterDto): Promise<any> {
    const user = await this.usersService.create(payload);
    this.logger.log(`User registered: ${user.id}`);
    this.logger.debug(`Email: ${payload.email}`);
    return await this.authService.login(user);
  }

  @Post('refresh')
  @ApiCreatedResponse({
    description: 'Successful token refresh',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async refreshToken(@Body() payload: RegisterDto): Promise<any> {
    const user = await this.usersService.create(payload);
    this.logger.log(`User registered: ${user.id}`);
    this.logger.debug(`Email: ${payload.email}`);
    return await this.authService.login(user);
  }
}
