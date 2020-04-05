import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
  ParseBoolPipe,
  ParseIntPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HelpListsService } from './help-lists.service';
import { HelpList } from './help-list.entity';
import { HelpListCreateDto } from './dto/help-list-create.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserID } from '../users/user.entity';
import { ReqUser } from '../../decorators/user.decorator';
import { HelpRequestByIdPipe } from '../helpRequests/help-request-by-id.pipe';
import { HelpRequest } from '../helpRequests/help-request.entity';
import { HelpListByIdPipe } from './help-list-by-id.pipe';

@ApiBearerAuth()
@ApiTags('Help Lists')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('help-lists')
export class HelpListsController {
  static LOGGER = new Logger('HelpLists', true);

  constructor(private readonly helpListsService: HelpListsService) {}

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
    type: 'integer',
  })
  async findOne(
    @Param('helpListId') helpListId: number,
    @ReqUser() user: UserID,
  ): Promise<HelpList> {
    return await this.helpListsService.getById(user.userId, helpListId);
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
    type: 'integer',
  })
  async updateHelpLists(
    @Param('helpListId', HelpListByIdPipe) helpList: HelpList,
    @Body() updateHelpList: HelpListCreateDto,
    @ReqUser() user: UserID,
  ): Promise<HelpList> {
    return this.helpListsService.update(user.userId, helpList, updateHelpList);
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
    type: 'integer',
  })
  @ApiParam({
    name: 'helpRequestId',
    description: 'Id of the help request',
    type: 'integer',
  })
  async addHelpRequestToList(
    @Param('helpListId', HelpListByIdPipe) helpList: HelpList,
    @Param('helpRequestId', HelpRequestByIdPipe) helpRequest: HelpRequest,
    @ReqUser() user: UserID,
  ): Promise<HelpList> {
    return this.helpListsService.addRequest(user.userId, helpList, helpRequest);
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
    type: 'integer',
  })
  @ApiParam({
    name: 'helpRequestId',
    description: 'Id of the help request',
    type: 'integer',
  })
  async deleteHelpRequestFromHelpList(
    @Param('helpListId', HelpListByIdPipe) helpList: HelpList,
    @Param('helpRequestId', HelpRequestByIdPipe) helpRequest: HelpRequest,
    @ReqUser() user: UserID,
  ): Promise<HelpList> {
    return this.helpListsService.removeRequest(
      user.userId,
      helpList,
      helpRequest,
    );
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
    type: 'integer',
  })
  @ApiParam({
    name: 'helpRequestId',
    description: 'Id of the help request',
    type: 'integer',
  })
  @ApiParam({
    name: 'articleId',
    description: 'Id of the article',
    type: 'integer',
  })
  @ApiQuery({
    required: true,
    name: 'articleDone',
    description: 'true to set the article as "bought"',
  })
  async modifyArticleInHelpRequest(
    @Query('articleDone', ParseBoolPipe) articleDone: boolean,
    @Param('helpListId', HelpListByIdPipe) helpList: HelpList,
    @Param('helpRequestId', ParseIntPipe) helpRequestId: number,
    @Param('articleId', ParseIntPipe) articleId: number,
    @ReqUser() user: UserID,
  ): Promise<HelpList> {
    return this.helpListsService.changeArticleDoneForRequest(
      user.userId,
      helpList,
      helpRequestId,
      articleId,
      articleDone,
    );
  }

  @Put(':helpListId/article/:articleId')
  @ApiOperation({ summary: 'Set/unset article done in all help requests' })
  @ApiOkResponse({ description: 'Successful', type: HelpList })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiForbiddenResponse({ description: 'This is not your shopping list' })
  @ApiNotFoundResponse({ description: 'Shopping list not found' })
  @ApiParam({
    name: 'helpListId',
    description: 'Id of the help list',
    type: 'integer',
  })
  @ApiParam({
    name: 'articleId',
    description: 'Id of the article',
    type: 'integer',
  })
  @ApiQuery({
    name: 'articleDone',
    description: 'true to set the article as "bought"',
  })
  async modifyArticleInAllHelpRequests(
    @Query('articleDone', ParseBoolPipe) articleDone: boolean,
    @Param('helpListId', HelpListByIdPipe) helpList: HelpList,
    @Param('articleId', ParseIntPipe) articleId: number,
    @ReqUser() user: UserID,
  ): Promise<HelpList> {
    return this.helpListsService.changeArticleDoneForAll(
      user.userId,
      helpList,
      articleId,
      articleDone,
    );
  }
}
