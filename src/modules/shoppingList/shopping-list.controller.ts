import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
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
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@Controller('shopping-list')
export class ShoppingListController {
  static LOGGER = new Logger('ShoppingList', true);

  constructor(
    private readonly shoppingListService: ShoppingListService,
    private readonly requestService: RequestService,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'Successful', type: [ShoppingList] })
  async getUserLists(@ReqUser() user: UserID): Promise<ShoppingList[]> {
    return await this.shoppingListService.getAllByUser(user.userId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Successful', type: ShoppingList })
  @ApiNotFoundResponse({ description: 'Shopping list not found' })
  @ApiForbiddenResponse({ description: 'This is not your shopping list' })
  async findOne(
    @Param('id') id: number,
    @ReqUser() user: UserID,
  ): Promise<ShoppingList> {
    return await this.findShoppingList(id, user.userId);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Added a new shopping list',
    type: ShoppingList,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async insertNewShoppingList(
    @Body() createRequestDto: ShoppingListFormDto,
    @ReqUser() user: UserID,
  ): Promise<ShoppingList> {
    return this.shoppingListService.create(createRequestDto, user);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Successful', type: ShoppingList })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Shopping list not found' })
  @ApiForbiddenResponse({ description: 'This is not your shopping list' })
  async updateShoppingList(
    @Param('id') id: number,
    @Body() updateShoppingList: ShoppingListFormDto,
    @ReqUser() user: UserID,
  ): Promise<ShoppingList> {
    const shoppingList = await this.findShoppingList(id, user.userId);
    return this.shoppingListService.update(updateShoppingList, shoppingList);
  }

  @Put(':shoppingListId/:requestId')
  @ApiOkResponse({ description: 'Successful', type: ShoppingList })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiForbiddenResponse({ description: 'This is not your shopping list' })
  @ApiNotFoundResponse({ description: 'Shopping list not found' })
  async addRequestToList(
    @Param('shoppingListId') shoppingListId: number,
    @Param('requestId') requestId: number,
    @ReqUser() user: UserID,
  ): Promise<ShoppingList> {
    const shoppingList = await this.findShoppingList(
      shoppingListId,
      user.userId,
    );
    const request = await this.requestService.get(requestId);
    ShoppingListController.LOGGER.log(request);
    if (!request) {
      throw new BadRequestException('This request does not exist');
    }
    return this.shoppingListService.addRequestToList(request.id, shoppingList);
  }

  @Delete(':shoppingListId/:requestId')
  @ApiOkResponse({ description: 'Successful', type: ShoppingList })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiForbiddenResponse({ description: 'This is not your shopping list' })
  @ApiNotFoundResponse({ description: 'Shopping list not found' })
  async deleteRequestFromList(
    @Param('shoppingListId') shoppingListId: number,
    @Param('requestId') requestId: number,
    @ReqUser() user: UserID,
  ): Promise<ShoppingList> {
    const shoppingList = await this.findShoppingList(
      shoppingListId,
      user.userId,
    );
    return this.shoppingListService.removeRequest(requestId, shoppingList);
  }

  private async findShoppingList(id: number, userId: number) {
    const shoppingList = await this.shoppingListService.get(id);
    if (shoppingList.owner !== userId) {
      throw new ForbiddenException(
        'You can only see or edit your own shopping lists!',
      );
    }
    return shoppingList;
  }
}
