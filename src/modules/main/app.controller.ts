import {Controller, Get, HttpStatus} from '@nestjs/common';
import {ApiBearerAuth, ApiResponse} from '@nestjs/swagger';

import {AppService} from './app.service';

@ApiBearerAuth()
@ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized'})
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  root(): string {
    return this.appService.root();
  }
}
