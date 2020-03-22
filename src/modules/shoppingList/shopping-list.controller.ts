import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {ApiBearerAuth, ApiCreatedResponse, ApiResponse, ApiTags} from '@nestjs/swagger';
import {ShoppingListService} from './shopping-list.service';
import {ShoppingList} from './shopping-list.entity';
import {CreateShoppingListDto} from './dto/create-shopping-list.dto';
import {ReqUser} from '../common/decorators/user.decorator';
import {JwtAuthGuard} from '../common/guards/jwt-guard';
import {UserID} from '../user/user.entity';

@ApiBearerAuth()
@ApiTags('Shopping List')
@UseGuards(JwtAuthGuard)
@Controller('shopping-list')
export class ShoppingListController {
  static LOGGER = new Logger('ShoppingList', true);

  constructor(private readonly shoppingListService: ShoppingListService) {
  }

  @Get()
  async getUserLists(@ReqUser() user: UserID): Promise<ShoppingList[]> {
    return await this.shoppingListService.getAllByUser(user.userId);
  }

  @Get(':id')
  @ApiResponse({status: HttpStatus.OK, description: 'Successful'})
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'Shopping list not found'})
  @ApiResponse({status: HttpStatus.FORBIDDEN, description: 'This is not your shopping list'})
  async findOne(@Param('id') id: number, @ReqUser() user: UserID): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListService.get(id);
    if (shoppingList.owner !== user.userId) {
      throw new ForbiddenException('You can only get your own shopping lists!');
    }
    return shoppingList;
  }

  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Added a new shopping list',
    type: ShoppingList,
  })
  @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'Request not found'})
  @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized'})
  @Post()
  async insertNewShoppingList(
    @Body() createRequestDto: CreateShoppingListDto,
    @ReqUser() user: UserID,
  ): Promise<ShoppingList> {
    ShoppingListController.LOGGER.log(createRequestDto);
    return this.shoppingListService.create(createRequestDto, user);
  }
}
