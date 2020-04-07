import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { ReqUser } from '../../decorators/user.decorator';
import { User, UserID } from './user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'Successful', type: [User] })
  async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get user profile of the requesting user' })
  @ApiOkResponse({ description: 'Successful', type: User })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findMe(@ReqUser() user: UserID): Promise<User> {
    return await this.userService.getById(user.userId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile of a specific user' })
  @ApiOkResponse({ description: 'Successful', type: User })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiParam({
    name: 'userId',
    description: 'user id',
  })
  async findOne(@Param('userId') userId: string): Promise<User> {
    return await this.userService.getById(userId);
  }

  @Put('/me')
  @ApiOperation({ summary: 'Update profile of the requesting user' })
  @ApiOkResponse({ description: 'Successful', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async updateMyself(
    @Body() updateUserDto: UpdateUserDto,
    @ReqUser() user: UserID,
  ): Promise<User> {
    const userToUpdate = await this.userService.getById(user.userId);
    return this.userService.update(updateUserDto, userToUpdate);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update profile of a specific user' })
  @ApiOkResponse({ description: 'Successful', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiParam({
    name: 'userId',
    description: 'user id',
  })
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @ReqUser() user: UserID,
  ): Promise<User> {
    const userToUpdate = await this.userService.getById(userId);
    if (userToUpdate.id !== user.userId) {
      throw new ForbiddenException('You cannot edit other users!');
    }
    return this.userService.update(updateUserDto, userToUpdate);
  }
}
