import {Controller, Get} from '@nestjs/common';
import {ApiBearerAuth} from '@nestjs/swagger';
import {RequestService} from './request.service';
import {Request} from './request.entity';

@ApiBearerAuth()
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {
  }

  @Get()
  async getAll(): Promise<Request[]> {
    return await this.requestService.getAll();
  }
}
