import {
  Controller,
  Get,
  Body,
  HttpStatus,
  UseInterceptors,
  Res,
  Param,
  Put,
  ClassSerializerInterceptor,
  Post,
  UseGuards,
  Redirect,
  HttpException,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiParam,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

const VoiceResponse = require('twilio').twiml.VoiceResponse;
import { CallsService } from './calls.service';
import { CallQueryDto } from './dto/call-query.dto';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Call } from './call.entity';
import { ConvertedHelpRequest } from './dto/converted-help-request.dto';

@Controller('call')
@ApiTags('Calls')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class CallsController {
  constructor(
    private readonly callService: CallsService,
    private readonly configService: ConfigurationService,
  ) {}

  @Post('twilio/call')
  @ApiOperation({ summary: 'Enpoint for incoming call webhook from twilio' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async incomingCall(@Res() res: any, @Body() body: any): Promise<any> {
    const twiml: any = new VoiceResponse();

    twiml.say(
      { language: 'de-DE' },
      'Willkommen bei nexd, der modernen Nachbarschaftshilfe, ' +
        'sprechen Sie Ihre Nachricht nach dem Signalton.',
    );
    twiml.record({
      action: '/api/v1/call/calls/recorded',
      method: 'POST',
    });
    twiml.say({ language: 'de-DE' }, 'Ich habe keine Nachricht empfangen.');

    this.callService.create(
      body.CallSid,
      body.From,
      body.FromCountry,
      body.FromCity,
      body.FromZip,
    );

    res.type('text/xml');
    res.send(twiml.toString());
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('calls')
  @ApiOperation({ summary: 'Returns all calls with the given parameters' })
  @ApiOkResponse({ description: 'Successful', type: Call, isArray: true })
  async calls(@Body() body: CallQueryDto): Promise<any> {
    return await this.callService.queryCalls(body);
  }

  @Post('calls/recorded')
  @ApiOperation({ summary: 'Enpoint for finished call recording from twilio ' })
  async receiveRecording(@Res() res: any, @Body() body: any): Promise<any> {
    this.callService.recorded(body.CallSid, body.RecordingUrl);
    res.status(200).send('Successful');
  }

  @UseGuards(JwtAuthGuard)
  @Put('calls/:sid/converted')
  @ApiOperation({ summary: 'Sets a call as converted to shopping list' })
  @ApiOkResponse({ description: 'Successful', type: Call })
  @ApiNotFoundResponse({ description: "Couldn't find call or help request" })
  @ApiParam({
    name: 'sid',
    description: 'call sid',
    type: 'string',
  })
  async converted(
    @Param('sid') sid: string,
    @Body() convertedHelpRequest: ConvertedHelpRequest,
  ): Promise<any> {
    const call: Call | undefined = await this.callService.converted(
      sid,
      convertedHelpRequest.helpRequestId,
    );
    if (!call) {
      throw new HttpException(
        'Call or help request not found.',
        HttpStatus.NOT_FOUND,
      );
    }
    return call;
  }

  @UseGuards(JwtAuthGuard)
  @Get('calls/:sid/record')
  @ApiOperation({ summary: 'Redirects the request to the stored record file.' })
  @ApiOkResponse({
    description: 'Successful',
    content: {
      'audio/x-wav': {
        schema: {
          type: 'string',
          format: 'binary',
          example: 'audio file',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Recording not found.' })
  @Redirect('')
  async getCallUrl(@Res() res: any, @Param('sid') sid: string): Promise<any> {
    const url = await this.callService.getCallRecord(sid);
    if (url) {
      return { statusCode: HttpStatus.FOUND, url };
    }
    throw new HttpException('Recording not found', HttpStatus.NOT_FOUND);
  }

  /* @UseGuards(JwtAuthGuard)
  @Get('calls/:sid/transcription')
  @ApiOperation({
    summary: 'Redirects the request to the stored transcription file',
  })
  @ApiOkResponse({ description: 'Successful' })
  @ApiNotFoundResponse({ description: 'Transcription not found.' })
  async getTranscriptionUrl(@Param('sid') sid: string): Promise<any> {
    const url = await this.callService.getCallTranscription(sid);
    if (url) {
      return { statusCode: HttpStatus.FOUND, url };
    }
    throw new HttpException('Transcription not found', HttpStatus.NOT_FOUND);
  } */
}
