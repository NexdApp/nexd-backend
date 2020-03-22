import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingListFormDto } from './dto/shopping-list-form.dto';
import { ReqUser } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-guard';
import { UserID } from '../user/user.entity';
import { RequestService } from '../request/request.service';

@ApiBearerAuth()
@ApiTags('Shopping List')
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@Controller('shopping-list')
export class ShoppingListController {
  static LOGGER = new Logger('ShoppingList', true);

  constructor(
    private readonly shoppingListService: ShoppingListService,
    private readonly requestService: RequestService,
  ) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful' })
  async getUserLists(@ReqUser() user: UserID): Promise<ShoppingList[]> {
    return await this.shoppingListService.getAllByUser(user.userId);
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shopping list not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'This is not your shopping list',
  })
  async findOne(
    @Param('id') id: number,
    @ReqUser() user: UserID,
  ): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListService.get(id);
    if (shoppingList.owner !== user.userId) {
      throw new ForbiddenException('You can only get your own shopping lists!');
    }
    return shoppingList;
  }

  @Post()
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Added a new shopping list',
    type: ShoppingList,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Request not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async insertNewShoppingList(
    @Body() createRequestDto: ShoppingListFormDto,
    @ReqUser() user: UserID,
  ): Promise<ShoppingList> {
    ShoppingListController.LOGGER.log(createRequestDto);
    return this.shoppingListService.create(createRequestDto, user);
  }

  @Put(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Updated' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shopping list not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async updateShoppingList(
    @Param('id') id: number,
    @Body() updateShoppingList: ShoppingListFormDto,
    @ReqUser() user: UserID,
  ): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListService.get(id);
    if (shoppingList.owner !== user.userId) {
      throw new ForbiddenException('You can only get your own shopping lists!');
    }
    return this.shoppingListService.update(updateShoppingList, shoppingList);
  }

  @Put(':id/:requestId')
  @ApiResponse({ status: HttpStatus.OK, description: 'Updated' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shopping lis not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async addRequestToList(
    @Param('id') id: number,
    @Param('requestId') requestId: number,
    @ReqUser() user: UserID,
  ): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListService.get(id);
    if (shoppingList.owner !== user.userId) {
      throw new ForbiddenException('You can only get your own shopping lists!');
    }
    const request = await this.requestService.get(requestId);
    if (!request) {
      throw new BadRequestException('This request does not exist');
    }
    return this.shoppingListService.addRequestToList(request.id, shoppingList);
  }
}
