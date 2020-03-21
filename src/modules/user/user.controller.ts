import {Body, Controller, Get, HttpStatus, Logger, Param, Put, UnauthorizedException} from '@nestjs/common';
import {ApiBearerAuth, ApiResponse, ApiTags} from '@nestjs/swagger';
import {ReqUser} from 'modules/common/decorators/user.decorator';
import {User} from 'modules/user/user.entity';
import {UsersService} from './user.service';
import {UpdateUserDto} from './dto/update-user.dto';

@ApiBearerAuth()
@Controller('user')
@ApiTags('User')
export class UserController {
  static LOGGER = new Logger('User', true);

  constructor(private readonly userService: UsersService) {
  }

  @Get()
  async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  @ApiResponse({status: HttpStatus.ACCEPTED, description: 'Successful'})
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'User not found'})
  async findOne(@Param('id') id: number): Promise<User> {
    return await this.userService.get(id);
  }

  @Put(':id')
  @ApiResponse({status: HttpStatus.ACCEPTED, description: 'Updated'})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'User not found'})
  @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized'})
  async update(@Param('id') id: number,
               @Body() updateUserDto: UpdateUserDto,
               @ReqUser() user: User,
  ): Promise<User> {
    UserController.LOGGER.log('User ' + await user);
    const expectedUser = await this.userService.get(id);
    UserController.LOGGER.log('Expect ' + await user);
    if (expectedUser.id !== user.id) {
      throw new UnauthorizedException('You cannot edit other users!');
    }
    return this.userService.update(updateUserDto, user);
  }
}
