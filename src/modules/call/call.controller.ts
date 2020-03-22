import {Controller, Get} from '@nestjs/common';
import {ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse} from '@nestjs/swagger';

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
  @ApiOkResponse({description: 'Successful'})
  @ApiBadRequestResponse({description: 'Bad Request'})
  async webhook(): Promise<any> {
  }
}
