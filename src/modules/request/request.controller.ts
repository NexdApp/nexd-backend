import {Body, Controller, Get, HttpStatus, Logger, Post, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiCreatedResponse, ApiResponse, ApiTags} from '@nestjs/swagger';
import {RequestService} from './request.service';
import {Request as RequestEntity} from './request.entity';
import {CreateRequestDto} from './dto/create-request.dto';
import {ReqUser} from '../common/decorators/user.decorator';
import {User} from '../user/user.entity';
import {JwtAuthGuard} from '../common/guards/jwt-guard';

@ApiBearerAuth()
@ApiTags('Request')
@UseGuards(JwtAuthGuard)
@ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized'})
@Controller('request')
export class RequestController {
  static LOGGER = new Logger('User', true);

  constructor(private readonly requestService: RequestService) {
  }

  @Get()
  async getAll(): Promise<RequestEntity[]> {
    return await this.requestService.getAll();
  }

  @ApiCreatedResponse({
    status: HttpStatus.ACCEPTED,
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
}
