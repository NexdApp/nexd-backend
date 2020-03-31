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
} from '@nestjs/swagger';
import { HelpRequestsService } from './help-requests.service';
import { HelpRequest } from './help-request.entity';
import { HelpRequestCreateDto } from './dto/help-request-create.dto';
import { ReqUser } from '../../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RequestArticleStatusDto } from '../helpList/dto/shopping-list-form.dto';
import { UserID } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@ApiBearerAuth()
@ApiTags('Help Requests')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('help-requests')
export class HelpRequestsController {
  static LOGGER = new Logger('Request', true);

  constructor(
    private readonly helpRequestsService: HelpRequestsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'Successful', type: [HelpRequest] })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by userId',
  })
  @ApiQuery({
    name: 'zipCode',
    required: false,
    description: 'Filter by zipCode',
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
    description: 'Array of status to filter for',
  })
  async getAll(
    @Query('userId') userId: string,
    @Query('zipCode') zipCode: string,
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
      zipCode,
      includeRequester: includeRequester === 'true',
      status,
    });
    return requests;
  }

  @ApiCreatedResponse({
    description: 'Add a complete request including articles.',
    type: HelpRequest,
  })
  @Post()
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
  @ApiOkResponse({ description: 'Successful', type: HelpRequest })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Request not found' })
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
  @ApiOkResponse({ description: 'Successful', type: HelpRequest })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Shopping request not found' })
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

  // @Put(':helpRequestId/:articleId')
  // @ApiOkResponse({ description: 'Successful', type: HelpRequest })
  // @ApiBadRequestResponse({ description: 'Bad request' })
  // @ApiNotFoundResponse({ description: 'Request not found' })
  // async markArticleAsDone(
  //   @Param('helpRequestId') helpRequestId: number,
  //   @Param('articleId') articleId: number,
  //   @Body() articleStatus: RequestArticleStatusDto,
  //   @ReqUser() user: UserID,
  // ): Promise<HelpRequest> {
  //   const entity = await this.helpRequestsService.updateRequestArticle(
  //     helpRequestId,
  //     articleId,
  //     articleStatus,
  //   );
  //   entity.requester = await this.usersService.getById(entity.requesterId);
  //   return entity;
  // }
}
