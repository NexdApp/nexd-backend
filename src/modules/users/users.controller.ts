import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { ReqUser } from '../../decorators/user.decorator';
import { User, UserID } from './user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('Users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOkResponse({ description: 'Successful', type: [User] })
  async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Get('/me')
  @ApiOkResponse({ description: 'Successful', type: User })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findMe(@ReqUser() user: UserID): Promise<User> {
    return await this.userService.getById(user.userId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Successful', type: User })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiParam({
    name: 'id',
    description: 'user id',
  })
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.getById(id);
  }

  @Put('/me')
  @ApiOkResponse({ description: 'Successful', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async updateMyself(
    @Body() updateUserDto: UpdateUserDto,
    @ReqUser() user: UserID,
  ): Promise<User> {
    this.logger.log(user);
    this.logger.log('test');
    const userToUpdate = await this.userService.getById(user.userId);
    return this.userService.update(updateUserDto, userToUpdate);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Successful', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiParam({
    name: 'id',
    description: 'user id',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @ReqUser() user: UserID,
  ): Promise<User> {
    const userToUpdate = await this.userService.getById(id);
    if (userToUpdate.id !== user.userId) {
      throw new ForbiddenException('You cannot edit other users!');
    }
    return this.userService.update(updateUserDto, userToUpdate);
  }
}
