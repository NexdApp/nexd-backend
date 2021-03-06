import {
  Controller,
  Get,
  Body,
  UseInterceptors,
  Res,
  Param,
  ClassSerializerInterceptor,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiParam,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';

import { PhoneService } from './phone.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Call } from './call.entity';
import { GetCallsQueryParams } from './dto/get-calls-query-params.dto';
import { ReqUser } from '../../decorators/user.decorator';
import { UserID } from '../users/user.entity';
import { HelpRequestCreateDto } from '../helpRequests/dto/help-request-create.dto';
import { PhoneNumberDto } from './dto/phone-number.dto';

@Controller('phone')
@ApiTags('Phone')
@UseInterceptors(ClassSerializerInterceptor)
export class PhoneController {
  constructor(private readonly callService: PhoneService) {}

  @Get('numbers')
  @ApiOperation({ summary: 'Returns available numbers' })
  async getNumbers(): Promise<PhoneNumberDto[]> {
    const number1 = new PhoneNumberDto(
      'de-DE',
      'DE',
      'Erste Hotline in Deutschland',
      '+49 721 98419016',
    );

    return [number1];
  }

  // TODO auth
  @Post('twilio/incoming-call')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Called by twilio' })
  async incomingCall(@Res() res: any, @Body() body: any): Promise<any> {
    this.callService.handleIncomingCall(res, body);
  }

  // TODO auth
  @Post('twilio/record-callback')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Called by twilio' })
  async receiveRecording(@Body() body: any): Promise<any> {
    this.callService.getAndSaveRecord(
      body.CallSid,
      body.RecordingUrl,
      body.RecordingDuration,
    );

    return {
      message: 'Successful',
    };
  }

  @Get('calls')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Returns all calls with the given parameters' })
  @ApiOkResponse({ description: 'Successful', type: Call, isArray: true })
  async getCalls(
    @Query() query: GetCallsQueryParams,
    @ReqUser() user: UserID,
  ): Promise<Call[]> {
    if (query.userId === 'me') {
      query.userId = user.userId;
    }
    return this.callService.queryCalls(query);
  }

  @Post('calls/:sid/help-request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Creates a new help request for a call and creates a user for the phoneNumber',
  })
  @ApiCreatedResponse({ description: 'Successful', type: Call })
  @ApiNotFoundResponse({ description: "Couldn't find call or help request" })
  @ApiParam({
    name: 'sid',
    description: 'call sid',
    type: 'string',
  })
  async converted(
    @Param('sid') sid: string,
    @Body() createHelpRequestDto: HelpRequestCreateDto,
    @ReqUser() user: UserID,
  ): Promise<any> {
    return this.callService.helpRequestAndUserFromCall(
      sid,
      createHelpRequestDto,
      user.userId,
    );
  }

  @Get('audio/:language/:file')
  @ApiExcludeEndpoint()
  async serveAudioFile(
    @Res() response: any,
    @Param() parameters: { language: string; file: string },
  ) {
    response.setHeader('Content-Type', 'audio/mpeg');
    response.attachment(parameters.file);
    return response.download(
      './src/modules/phone/audio/' +
        parameters.language +
        '/' +
        parameters.file,
    );
  }
}
