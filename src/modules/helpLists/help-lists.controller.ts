import {
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
  Query,
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
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { HelpListsService } from './help-lists.service';
import { HelpList } from './help-list.entity';
import { HelpListCreateDto } from './dto/help-list-create.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HelpRequestsService } from '../helpRequests/help-requests.service';
import { ReqUser } from 'src/decorators/user.decorator';
import { UserID } from '../users/user.entity';

@ApiBearerAuth()
@ApiTags('Help Lists')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@Controller('help-lists')
export class HelpListsController {
  static LOGGER = new Logger('HelpLists', true);

  constructor(
    private readonly helpListsService: HelpListsService,
    private readonly helpRequestService: HelpRequestsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get help lists of the requesting user' })
  @ApiOkResponse({ description: 'Successful', type: [HelpList] })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'If included, filter by userId, otherwise by requesting user.',
  })
  async getUserLists(
    @Query('userId') userId: string,
    @ReqUser() user: UserID,
  ): Promise<HelpList[]> {
    let userIdFilter = userId;
    if (!userId) {
      userIdFilter = user.userId;
    }
    return await this.helpListsService.getAllByUser(userIdFilter);
  }

  @Get(':helpListId')
  @ApiOperation({ summary: 'Get a specific help list' })
  @ApiOkResponse({ description: 'Successful', type: HelpList })
  @ApiNotFoundResponse({ description: 'Help list not found' })
  @ApiForbiddenResponse({ description: 'This is not your help list' })
  @ApiParam({
    name: 'helpListId',
    description: 'Id of the help list',
  })
  async findOne(
    @Param('helpListId') helpListId: number,
    @ReqUser() user: UserID,
  ): Promise<HelpList> {
    return await this.helpListsService.get(user.userId, helpListId);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new help list for the current user' })
  @ApiCreatedResponse({
    description: 'Added a new help list',
    type: HelpList,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async insertNewHelpList(
    @Body() createRequestDto: HelpListCreateDto,
    @ReqUser() user: UserID,
  ): Promise<HelpList> {
    return this.helpListsService.create(user.userId, createRequestDto);
  }

  @Put(':helpListId')
  @ApiOperation({ summary: 'Modify a help list' })
  @ApiOkResponse({ description: 'Successful', type: HelpList })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Shopping list not found' })
  @ApiForbiddenResponse({ description: 'This is not your shopping list' })
  @ApiParam({
    name: 'helpListId',
    description: 'Id of the help list',
  })
  async updateHelpLists(
    @Param('helpListId') helpListId: number,
    @Body() updateHelpList: HelpListCreateDto,
    @ReqUser() user: UserID,
  ): Promise<HelpList> {
    return this.helpListsService.update(
      user.userId,
      helpListId,
      updateHelpList,
    );
  }

  @Put(':helpListId/help-request/:helpRequestId')
  @ApiOperation({ summary: 'Add a help request to a help list' })
  @ApiOkResponse({ description: 'Successful', type: HelpList })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiForbiddenResponse({ description: 'This is not your shopping list' })
  @ApiNotFoundResponse({ description: 'Shopping list not found' })
  @ApiParam({
    name: 'helpListId',
    description: 'Id of the help list',
  })
  @ApiParam({
    name: 'helpRequestId',
    description: 'Id of the help request',
  })
  async addHelpRequestToList(
    @Param('helpListId') helpListId: number,
    @Param('helpRequestId') helpRequestId: number,
    @ReqUser() user: UserID,
  ): Promise<HelpList> {
    // TODO
    return;
  }

  @Delete(':helpListId/help-request/:helpRequestId')
  @ApiOperation({ summary: 'Delete a help request from help list' })
  @ApiOkResponse({ description: 'Successful', type: HelpList })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiForbiddenResponse({ description: 'This is not your shopping list' })
  @ApiNotFoundResponse({ description: 'Shopping list not found' })
  @ApiParam({
    name: 'helpListId',
    description: 'Id of the help list',
  })
  @ApiParam({
    name: 'helpRequestId',
    description: 'Id of the help request',
  })
  async deleteHelpRequestFromHelpList(
    @Param('helpListId') helpListId: number,
    @Param('helpRequestId') helpRequestId: number,
    @ReqUser() user: UserID,
  ): Promise<HelpList> {
    // TODO
    return;
  }

  @Put(':helpListId/help-request/:helpRequestId/article/:articleId')
  @ApiOperation({
    summary: 'Set/unset articleDone of an article in a specific help request',
  })
  @ApiOkResponse({ description: 'Successful', type: HelpList })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiForbiddenResponse({ description: 'This is not your shopping list' })
  @ApiNotFoundResponse({ description: 'Shopping list not found' })
  @ApiParam({
    name: 'helpListId',
    description: 'Id of the help list',
  })
  @ApiParam({
    name: 'helpRequestId',
    description: 'Id of the help request',
  })
  @ApiParam({
    name: 'articleId',
    description: 'Id of the article',
  })
  @ApiQuery({
    name: 'articleDone',
    description: 'true to set the article as "bought"',
  })
  async modifyArticleInHelpRequest(
    @Query('articleDone') articleDone: string,
    @Param('helpListId') helpListId: number,
    @Param('helpRequestId') helpRequestId: number,
    @ReqUser() user: UserID,
  ): Promise<HelpList> {
    console.log(typeof articleDone);
    // TODO
    return;
  }

  @Put(':helpListId/article/:articleId')
  @ApiOperation({ summary: 'Set/unset article done in all help requests' })
  @ApiOkResponse({ description: 'Successful', type: HelpList })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiForbiddenResponse({ description: 'This is not your shopping list' })
  @ApiNotFoundResponse({ description: 'Shopping list not found' })
  @ApiQuery({
    name: 'articleDone',
    description: 'true to set the article as "bought"',
  })
  @ApiParam({
    name: 'helpListId',
    description: 'Id of the help list',
  })
  @ApiParam({
    name: 'articleId',
    description: 'Id of the article',
  })
  @ApiQuery({
    name: 'articleDone',
    description: 'true to set the article as "bought"',
  })
  async modifyArticleInAllHelpRequests(
    @Query() articleDone: boolean,
    @Param('helpListId') helpListId: number,
    @Param() articleId: number,
    @ReqUser() user: UserID,
  ): Promise<HelpList> {
    return;
  }
}
