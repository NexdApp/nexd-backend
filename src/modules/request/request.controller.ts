import {Body, Controller, Get, Logger, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {RequestService} from './request.service';
import {Request as RequestEntity} from './request.entity';
import {CreateRequestDto} from './dto/create-request.dto';
import {ReqUser} from '../common/decorators/user.decorator';
import {JwtAuthGuard} from '../common/guards/jwt-guard';
import {RequestArticleStatusDto} from '../shoppingList/dto/shopping-list-form.dto';
import {UserID} from '../user/user.entity';

@ApiBearerAuth()
@ApiTags('Request')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({description: 'Unauthorized'})
@Controller('request')
export class RequestController {
  static LOGGER = new Logger('Request', true);

  constructor(private readonly requestService: RequestService) {
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
    return await this.requestService.getAll(user, onlyMine);
  }

  @ApiCreatedResponse({
    description: 'Add a complete request including articles.',
    type: RequestEntity,
  })
  @Post()
  async insertRequestWithArticles(
    @Body() createRequestDto: CreateRequestDto,
    @ReqUser() user: any,
  ): Promise<RequestEntity> {
    return this.requestService.create(createRequestDto, user);
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
    return await this.requestService.updateRequestArticle(requestId, articleId, articleStatus);
  }
}
