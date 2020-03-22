import {Body, Controller, Get, Logger, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
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
import {RequestService} from './request.service';
import {RequestEntity} from './request.entity';
import {RequestFormDto} from './dto/request-form.dto';
import {ReqUser} from '../common/decorators/user.decorator';
import {JwtAuthGuard} from '../common/guards/jwt-guard';
import {RequestArticleStatusDto} from '../shoppingList/dto/shopping-list-form.dto';
import {UserID} from '../user/user.entity';
import {UsersService} from '../user/user.service';

@ApiBearerAuth()
@ApiTags('Request')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({description: 'Unauthorized'})
@Controller('request')
export class RequestController {
  static LOGGER = new Logger('Request', true);

  constructor(private readonly requestService: RequestService, private readonly userService: UsersService) {
  }

  @Get()
  @ApiOkResponse({description: 'Successful', type: [RequestEntity]})
  @ApiQuery({
    name: 'onlyMine',
    required: false,
    description:
      'if "true", only the requesting user requests will be replied.',
  })
  async getAll(
    @Query('onlyMine') onlyMine: string,
    @ReqUser() user: any,
  ): Promise<RequestEntity[]> {
    const requests = await this.requestService.getAll(user, onlyMine);
    if (onlyMine !== 'true')
      requests.map(async (r) => {
        r.requester = await this.userService.get(r.requesterId);
      });
    return requests;
  }

  @ApiCreatedResponse({
    description: 'Add a complete request including articles.',
    type: RequestEntity,
  })
  @Post()
  async insertRequestWithArticles(
    @Body() createRequestDto: RequestFormDto,
    @ReqUser() user: UserID,
  ): Promise<RequestEntity> {
    const entity = await this.requestService.create(createRequestDto, user);
    entity.requester = await this.userService.get(entity.requesterId);
    return entity;
  }

  @Put(':requestId')
  @ApiOkResponse({description: 'Successful', type: RequestEntity})
  @ApiBadRequestResponse({description: 'Bad request'})
  @ApiNotFoundResponse({description: 'Request not found'})
  async updateRequest(
    @Param('requestId') requestId: number,
    @Body() requestFormDto: RequestFormDto,
    @ReqUser() user: UserID,
  ): Promise<RequestEntity> {
    const entity = await this.requestService.update(requestId, requestFormDto);
    entity.requester = await this.userService.get(entity.requesterId);
    return entity;
  }

  @Put(':requestId/:articleId')
  @ApiOkResponse({description: 'Successful', type: RequestEntity})
  @ApiBadRequestResponse({description: 'Bad request'})
  @ApiNotFoundResponse({description: 'Request not found'})
  async markArticleAsDone(
    @Param('requestId') requestId: number,
    @Param('articleId') articleId: number,
    @Body() articleStatus: RequestArticleStatusDto,
    @ReqUser() user: UserID,
  ): Promise<RequestEntity> {
    const entity = await this.requestService.updateRequestArticle(requestId, articleId, articleStatus);
    entity.requester = await this.userService.get(entity.requesterId);
    return entity;
  }
}
