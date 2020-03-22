import {
  Body,
  Controller, ForbiddenException,
  Get,
  HttpStatus,
  Logger,
  Param,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReqUser } from '../common/decorators/user.decorator';
import {User, UserID} from './user.entity';
import { UsersService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-guard';

@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiTags('User')
export class UserController {
  static LOGGER = new Logger('User', true);

  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async findOne(@Param('id') id: number): Promise<User> {
    return await this.userService.get(id);
  }

  @Put(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Updated' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
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
