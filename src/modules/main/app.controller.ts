import {Controller, Get} from '@nestjs/common';

import {AppService} from './app.service';
import {ApiOkResponse} from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  @ApiOkResponse({description: 'Successful'})
  root(): string {
    return this.appService.root();
  }
}
