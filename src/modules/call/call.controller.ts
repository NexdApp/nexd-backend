<<<<<<< Updated upstream
import {Controller, Get} from '@nestjs/common';
import {ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse} from '@nestjs/swagger';
=======
import { Controller, Get, Body, HttpStatus, UseInterceptors, Post, UploadedFile } from '@nestjs/common';
import { ApiResponse, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadCallPayloadDto } from './dto/upload-call-payload.dto';
import { TranslatedCallPayloadDto } from './dto/translated-call-payload.dto';
>>>>>>> Stashed changes

@Controller('call')
@ApiTags('Calls')
@ApiUnauthorizedResponse({description: 'Unauthorized'})
export class CallController {
  @Get()
  @ApiOkResponse({description: 'Successful'})
  index(): string {
    return 'call';
  }

  @Get('listen')
  @ApiOkResponse({description: 'Successful'})
  @ApiBadRequestResponse({description: 'Bad Request'})
  async listen(): Promise<any> {
  }

  @Get('webhook')
<<<<<<< Updated upstream
  @ApiOkResponse({description: 'Successful'})
  @ApiBadRequestResponse({description: 'Bad Request'})
  async webhook(): Promise<any> {
  }
=======
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async webhook(): Promise<any> {}


  @Get('upload')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async init_upload(@Body() payload: UploadCallPayloadDto): Promise<any>{
      
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiParam({
    name: 'id',
    description: 'audio id',
    type: 'integer',
  })
  async upload(): Promise<any>{

  }

  @Get('translated')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async translated(@Body() payload: TranslatedCallPayloadDto): Promise<any> {}
>>>>>>> Stashed changes
}
