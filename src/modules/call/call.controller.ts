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
} from '@nestjs/common';
import {
  ApiResponse,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { webhook } from 'twilio/lib/webhooks/webhooks';
import Twilio, { TwilioClientOptions } from 'twilio/lib/rest/Twilio';
//import  VoiceResponse  from 'twilio/twiml/VoiceResponse';
const VoiceResponse = require('twilio').twiml.VoiceResponse;
import { ConfigService } from 'modules/config/config.service';
import { CallService } from './call.service';
import { CallQueryDto } from './dto/callQueryDto.dt';
import { Call } from './call.entity';


@Controller('call')
@ApiTags('Calls')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class CallController {
  constructor(private readonly callService: CallService,
              private readonly configService: ConfigService) {}
 
  @Post('twilio/call')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async incomingCall(@Req() req: any, @Res() res: any, @Body() body: any): Promise<any> {   
    const twiml: any = new VoiceResponse();
    // TODO: Set language to callers language
    const gather = twiml.gather({
      action: '/introduction',
      method: 'POST',
      actionOnEmptyResult: true,
      input: 'speech'
      });

    this.callService.create(body.CallSid, 
                            body.From, 
                            body.FromCountry, 
                            body.FromCity, 
                            body.FromZip);
    
    // TODO: Multiple languuage support
    gather.say("Willkommen bei nexd, der modernen Nachbarschaftshilfe,"
                +"wenn sie eine Einführung in unser System wollen sagen sie"
                +"Einführung, wenn nicht sagen sie kurz 5 sekunden nichts");


    res.type('text/xml');
    res.send(twiml.toString());
  }

  @Post('twilio/indtroduction')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async callIntroduction(@Req() req: any, @Res() res: any, @Body() body: any): Promise<any> {   
    const twiml: any = new VoiceResponse();
    const gather = twiml.gather({
      action: '/introduction',
      method: 'POST',
      actionOnEmptyResult: true,
      input: 'speech'
      });  

    // TODO: More actions to gather caller info 
  }


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

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('calls')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async calls(@Body() body: CallQueryDto): Promise<any> {
    return await this.callService.queryCalls(body);
  }

  @Get('calls/:sid/record')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async getCallUrl(@Param('sid') sid: string): Promise<any> {
    return await this.callService.getCallRecord(sid);
  }

  @Get('calls/:sid/transcription')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async getTranscriptionUrl(@Param('sid') sid: string): Promise<any> {
    return await this.callService.getCallTranscription(sid);
  }
}
