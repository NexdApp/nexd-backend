import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { RequestService } from './request.service';
import { Request as RequestEntity } from './request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { ReqUser } from 'modules/common/decorators/user.decorator';
import { User } from 'modules/user/user.entity';
import { JwtAuthGuard } from 'modules/common/guards/jwt-guard';

@ApiBearerAuth()
@ApiTags('Request')
@UseGuards(JwtAuthGuard)
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

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
