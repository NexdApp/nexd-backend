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
} from '@nestjs/swagger';

//import  VoiceResponse  from 'twilio/twiml/VoiceResponse';
const VoiceResponse = require('twilio').twiml.VoiceResponse;
import { CallsService } from './calls.service';
import { CallQueryDto } from './dto/call-query.dto';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Call } from './call.entity';
import { ConvertedHelpRequestDto } from './dto/converted-help-request.dto';

@Controller('call')
@ApiTags('Calls')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class CallsController {
  constructor(
    private readonly callService: CallsService,
    private readonly configService: ConfigurationService,
  ) {}

  @Get('number')
  @ApiOperation({ summary: 'Returns available numbers' })
  @ApiOkResponse({
    description: 'Success',
    content: {
      'applicaton/json': {
        schema: {
          type: 'string',
          format: 'json',
          example: '{\n  "number": "+49 721 98419016"\n}',
        },
      },
    },
  })
  async getNumber(): Promise<any> {
    return {
      number: '+49 721 98419016',
    };
  }

  @Post('twilio/call')
  @ApiOperation({ summary: 'Enpoint for incoming call webhook from twilio' })
  @ApiOkResponse({ description: 'Success' })
  async incomingCall(@Res() res: any, @Body() body: any): Promise<any> {
    const twiml: any = new VoiceResponse();

    twiml.say(
      { language: 'de-DE' },
      'Willkommen bei nexd, der modernen Nachbarschaftshilfe, ' +
        'sprechen Sie Ihre Nachricht nach dem Signalton.',
    );
    twiml.record({
      action: '/api/v1/call/twilio/recorded',
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

  @Post('twilio/recorded')
  @ApiOperation({ summary: 'Enpoint for finished call recording from twilio ' })
  async receiveRecording(@Res() res: any, @Body() body: any): Promise<any> {
    this.callService.recorded(body.CallSid, body.RecordingUrl);
    res.status(200).send('Successful');
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('calls')
  @ApiOperation({ summary: 'Returns all calls with the given parameters' })
  @ApiOkResponse({ description: 'Successful', type: Call, isArray: true })
  async calls(@Body() body: CallQueryDto): Promise<any> {
    return await this.callService.queryCalls(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('converted/:sid')
  @ApiOperation({ summary: 'Sets a call as converted to shopping list' })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiParam({
    name: 'sid',
    description: 'call sid',
    type: 'string',
  })
  async converted(
    @Param('sid') sid: string,
    @Body() convertedHelpRequest: ConvertedHelpRequestDto,
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
  }

  @UseGuards(JwtAuthGuard)
  @Get('calls/:sid/record')
  @ApiOperation({ summary: 'Redirects the request to the stored record file' })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Redirect('')
  async getCallUrl(@Res() res: any, @Param('sid') sid: string): Promise<any> {
    const url = await this.callService.getCallRecord(sid);
    if (url) {
      return { statusCode: HttpStatus.FOUND, url };
    }
    throw new HttpException('Recording not found', HttpStatus.NOT_FOUND);
  }

  @UseGuards(JwtAuthGuard)
  @Get('calls/:sid/transcription')
  @ApiOperation({
    summary: 'Redirects the request to the stored transcription file',
  })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async getTranscriptionUrl(@Param('sid') sid: string): Promise<any> {
    const url = await this.callService.getCallTranscription(sid);
    if (url) {
      return { statusCode: HttpStatus.FOUND, url };
    }
    throw new HttpException('Transcription not found', HttpStatus.NOT_FOUND);
  }
}
