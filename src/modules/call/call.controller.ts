import { Controller, Get, Body, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller('call')
export class CallController {
  @Get()
  index(): string {
    return 'call';
  }

  @Get('listen')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async listen(): Promise<any> {}

  @Get('webhook')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async webhook(): Promise<any> {}
}
