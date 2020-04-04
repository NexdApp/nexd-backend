import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Delete,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { HelpRequestsService } from './help-requests.service';
import { HelpRequest } from './help-request.entity';
import { HelpRequestCreateDto } from './dto/help-request-create.dto';
import { ReqUser } from '../../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RequestArticleStatusDto } from '../helpList/dto/shopping-list-form.dto';
import { UserID } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { HelpRequestStatus } from './help-request-status';
import { HelpRequestByIdPipe } from './help-request-by-id.pipe';
import { CreateOrUpdateHelpRequestArticleDto } from './dto/help-request-article-create.dto';

@ApiBearerAuth()
@ApiTags('Help Requests')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('help-requests')
export class HelpRequestsController {
  private readonly logger = new Logger(HelpRequestsController.name);

  constructor(
    private readonly helpRequestsService: HelpRequestsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get and filter for various help requests' })
  @ApiOkResponse({ description: 'Successful', type: [HelpRequest] })
  @ApiQuery({
    name: 'userId',
    required: false,
    description:
      'If included, filter by userId, "me" for the requesting user, otherwise all users are replied.',
  })
  @ApiQuery({
    name: 'excludeUserId',
    required: false,
    description:
      'If true, the given userId is excluded (and not filtered for as default)',
  })
  @ApiQuery({
    name: 'zipCode',
    type: [String],
    required: false,
    description: 'Filter by an array of zipCodes',
  })
  @ApiQuery({
    name: 'includeRequester',
    required: false,
    description:
      'If "true", the requester object is included in each help request',
  })
  @ApiQuery({
    name: 'status',
    isArray: true,
    required: false,
    enum: HelpRequestStatus,
    description: 'Array of status to filter for',
  })
  async getAll(
    @Query('userId') userId: string,
    @Query('excludeUserId') excludeUserId: string,
    @Query('zipCode') zipCode: string[],
    @Query('includeRequester') includeRequester: string,
    @Query('status') status: string[],
    @ReqUser() user: any,
  ): Promise<HelpRequest[]> {
    let userIdFilter = userId;
    if (userId === 'me') {
      userIdFilter = user.userId;
    }
    const requests = await this.helpRequestsService.getAll({
      userId: userIdFilter,
      excludeUserId: excludeUserId === 'true',
      zipCode,
      includeRequester: includeRequester === 'true',
      status,
    });
    return requests;
  }

  @Post()
  @ApiOperation({ summary: 'Add a help request' })
  @ApiCreatedResponse({
    description: 'Add a complete request including articles.',
    type: HelpRequest,
  })
  async insertRequestWithArticles(
    @Body() createHelpRequestDto: HelpRequestCreateDto,
    @ReqUser() user: UserID,
  ): Promise<HelpRequest> {
    const entity = await this.helpRequestsService.create(
      createHelpRequestDto,
      user.userId,
    );
    return entity;
  }

  @Get(':helpRequestId')
  @ApiOperation({ summary: 'Get a single help request by id' })
  @ApiOkResponse({ description: 'Successful', type: HelpRequest })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Request not found' })
  @ApiParam({
    name: 'helpRequestId',
    description: 'Id of the help request',
  })
  async getSingleRequest(
    @Param('helpRequestId') helpRequestId: number,
  ): Promise<HelpRequest> {
    const entity = await this.helpRequestsService.get(helpRequestId);
    if (!entity) {
      throw new NotFoundException('This shopping request does not exist');
    }
    entity.requester = await this.usersService.getById(entity.requesterId);
    return entity;
  }

  @Put(':helpRequestId')
  @ApiOperation({ summary: 'Modify a help request (e.g. address or articles)' })
  @ApiOkResponse({ description: 'Successful', type: HelpRequest })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Help request not found' })
  @ApiParam({
    name: 'helpRequestId',
    description: 'Id of the help request',
  })
  async updateRequest(
    @Param('helpRequestId') helpRequestId: number,
    @Body() helpRequestCreateDto: HelpRequestCreateDto,
  ): Promise<HelpRequest> {
    const entity = await this.helpRequestsService.update(
      helpRequestId,
      helpRequestCreateDto,
    );
    return entity;
  }

  @Put(':helpRequestId/article/:articleId')
  @ApiOperation({
    summary: 'Put an article to a help request, endpoint overrides.',
  })
  @ApiOkResponse({ description: 'Successful', type: HelpRequest })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Help request not found' })
  @ApiParam({
    name: 'helpRequestId',
    description: 'Id of the help request',
    type: 'integer',
  })
  @ApiParam({
    name: 'articleId',
    description: 'Id of the article',
  })
  async addArticleInHelpRequest(
    @Param('helpRequestId', HelpRequestByIdPipe) helpRequest: HelpRequest,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Body() helpRequestArticleDto: CreateOrUpdateHelpRequestArticleDto,
  ): Promise<HelpRequest> {
    return this.helpRequestsService.addOrUpdateArticle(
      helpRequest,
      articleId,
      helpRequestArticleDto,
    );
  }

  @Delete(':helpRequestId/article/:articleId')
  @ApiOperation({ summary: 'Remove an article from a help request' })
  @ApiOkResponse({ description: 'Successful', type: HelpRequest })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Help request not found' })
  @ApiParam({
    name: 'helpRequestId',
    description: 'Id of the help request',
    type: 'integer',
  })
  @ApiParam({
    name: 'articleId',
    description: 'Id of the article',
  })
  async removeArticleInHelpRequest(
    @Param('helpRequestId', HelpRequestByIdPipe) helpRequest: HelpRequest,
    @Param('articleId', ParseIntPipe) articleId: number,
  ): Promise<HelpRequest> {
    return this.helpRequestsService.removeArticle(helpRequest, articleId);
  }
}
