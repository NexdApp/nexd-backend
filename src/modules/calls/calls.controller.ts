import {
  Controller,
  Get,
  Body,
  HttpStatus,
  UseInterceptors,
  Req,
  Res,
  Param,
  Put,
  ClassSerializerInterceptor,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';

//import  VoiceResponse  from 'twilio/twiml/VoiceResponse';
const VoiceResponse = require('twilio').twiml.VoiceResponse;
import { CallsService } from './calls.service';
import { CallQueryDto } from './dto/call-query.dto';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('call')
@ApiTags('Calls')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class CallsController {
  constructor(private readonly callService: CallsService,
    private readonly configService: ConfigurationService
  ) { }

  @Post('twilio/call')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async incomingCall(@Res() res: any, @Body() body: any): Promise<any> {

    const twiml: any = new VoiceResponse();

    twiml.say({ language: 'de-DE' }, "Willkommen bei nexd, der modernen Nachbarschaftshilfe, "
      + "sprechen Sie Ihre Nachricht nach dem Signalton.");
    twiml.record({
      action: '/api/v1/call/twilio/recorded',
      method: 'POST'
    });
    twiml.say({ language: 'de-DE' }, 'Ich habe keine Nachricht empfangen.')

    this.callService.create(body.CallSid,
      body.From,
      body.FromCountry,
      body.FromCity,
      body.FromZip
    );

    res.type('text/xml');
    res.send(twiml.toString());
  }

  @Post('twilio/recorded')
  async receiveRecording(@Res() res: any, @Body() body: any): Promise<any> {
    this.callService.recorded(body.CallSid, body.RecordingUrl);
    res.status(200).send('Successful');
  }

  @UseGuards(JwtAuthGuard)
  @Put('converted/:sid')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiParam({
    name: 'sid',
    description: 'call sid',
    type: 'string',
  })
  async converted(@Res() res: any, @Param('sid') sid: string): Promise<any> {
    if (this.callService) {
      this.callService.converted(sid);
      return res.status(200).json('Set converted successfull');
    } else {
      return res.status(500).json('Failed to set converted');
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('calls')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async calls(@Body() body: CallQueryDto): Promise<any> {
    return await this.callService.queryCalls(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('calls/:sid/record')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async getCallUrl(@Param('sid') sid: string): Promise<any> {
    return await this.callService.getCallRecord(sid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('calls/:sid/transcription')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async getTranscriptionUrl(@Param('sid') sid: string): Promise<any> {
    return await this.callService.getCallTranscription(sid);
  }
}
