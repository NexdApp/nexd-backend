import {Body, Controller, Get, HttpStatus, Logger, Param, Post, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiCreatedResponse, ApiResponse, ApiTags} from '@nestjs/swagger';
import {ShoppingListService} from './shopping-list.service';
import {ShoppingList} from './shopping-list.entity';
import {CreateShoppingListDto} from './dto/create-shopping-list.dto';
import {ReqUser} from '../common/decorators/user.decorator';
import {JwtAuthGuard} from '../common/guards/jwt-guard';

@ApiBearerAuth()
@ApiTags('Shopping List')
@UseGuards(JwtAuthGuard)
@Controller('shopping-list')
export class ShoppingListController {
  static LOGGER = new Logger('ShoppingList', true);

  constructor(private readonly shoppingListService: ShoppingListService) {
  }

  @Get()
  async getAll(): Promise<ShoppingList[]> {
    return await this.shoppingListService.getAll();
  }

  @Get(':id')
  @ApiResponse({status: HttpStatus.OK, description: 'Successful'})
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'Shopping List not found'})
  async findOne(@Param('id') id: number): Promise<ShoppingList> {
    return await this.shoppingListService.get(id);
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
    @ReqUser() user: any,
  ): Promise<ShoppingList> {
    ShoppingListController.LOGGER.log(createRequestDto);
    return this.shoppingListService.create(createRequestDto, user);
  }
}
