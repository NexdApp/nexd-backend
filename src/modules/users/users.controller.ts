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
// import {JwtAuthGuard} from '../common/guards/jwt-guard';

@ApiBearerAuth()
@Controller('users')
// @UseGuards(JwtAuthGuard)
@ApiTags('Users')
export class UserController {
  static LOGGER = new Logger('Users', true);

  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOkResponse({ description: 'Successful', type: [User] })
  async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Successful', type: User })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiParam({
    name: 'id',
    description: 'user id',
    type: 'integer',
  })
  async findOne(@Param('id') id: number): Promise<User> {
    return await this.userService.get(id);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Successful', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiParam({
    name: 'id',
    description: 'user id',
    type: 'integer',
  })
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @ReqUser() user: UserID,
  ): Promise<User> {
    const userToUpdate = await this.userService.get(id);
    if (userToUpdate.id !== user.userId) {
      throw new ForbiddenException('You cannot edit other users!');
    }
    return this.userService.update(updateUserDto, userToUpdate);
  }
}
