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
  ApiTags,
} from '@nestjs/swagger';

import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { TokenDto } from './dto/token.dto';

@ApiTags('Auth')
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
    description: 'Successful Login',
    type: TokenDto,
  })
  async login(@Request() req): Promise<TokenDto> {
    this.logger.log(`User login`);
    return await this.authService.createToken(req.user);
  }

  @Post('register')
  @ApiCreatedResponse({
    description: 'Successful Registration',
    type: TokenDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotAcceptableResponse({ description: 'Already exists' })
  async register(@Body() payload: RegisterDto): Promise<TokenDto> {
    const user = await this.usersService.create(payload);
    this.logger.log(`User registered: ${user.id}`);
    this.logger.debug(`Email: ${payload.email}`);
    return await this.authService.createToken(user);
  }

  @Post('refresh')
  @ApiCreatedResponse({
    description: 'Successful token refresh',
    type: TokenDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async refreshToken(@Body() payload: RegisterDto): Promise<TokenDto> {
    const user = await this.usersService.create(payload);
    this.logger.log(`User registered: ${user.id}`);
    this.logger.debug(`Email: ${payload.email}`);
    return await this.authService.createToken(user);
  }
}
