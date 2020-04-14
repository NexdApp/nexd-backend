import {
  Controller,
  Get,
  Body,
  HttpStatus,
  UseInterceptors,
  Res,
  Param,
  ClassSerializerInterceptor,
  Post,
  UseGuards,
  Redirect,
  HttpException,
  Query,
} from '@nestjs/common';
import {
  ApiParam,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';

const VoiceResponse = require('twilio').twiml.VoiceResponse;
import { PhoneService } from './phone.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Call } from './call.entity';
import {
  CountryHotlineNumbers,
  countryHotlineNumberExample,
} from './interfaces/CountryHotlineNumbers.interface';
import { GetCallsQueryParams } from './dto/get-calls-query-params.dto';
import { ReqUser } from 'src/decorators/user.decorator';
import { UserID } from '../users/user.entity';
import { HelpRequestCreateDto } from '../helpRequests/dto/help-request-create.dto';

@Controller('phone')
@ApiTags('Phone')
export class PhoneController {
  constructor(private readonly callService: PhoneService) {}

  @Get('numbers')
  @ApiOperation({ summary: 'Returns available numbers' })
  @ApiOkResponse({
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          type: 'string',
          format: 'json',
          example: JSON.stringify(countryHotlineNumberExample),
        },
      },
    },
  })
  async getNumbers(): Promise<CountryHotlineNumbers> {
    return countryHotlineNumberExample;
  }

  // TODO auth
  @Post('twilio/incoming-call')
  async incomingCall(@Res() res: any, @Body() body: any): Promise<any> {
    // TODO: body is not really used, it could also be the CallStatus: completed event
    // TODO: we need to check where a response is needed

    const twiml: any = new VoiceResponse();

    // TODO language selection, maybe through incoming number
    switch (body.FromCountry) {
      case 'DE':
        twiml.play(
          {
            loop: 1,
          },
          '/api/v1/phone/audio/DE/introduction.mp3',
        );
        break;

      default:
        twiml.say(
          { language: 'en-US' },
          "Welcome to nexd, we don't know your language but we continue with english",
        );
        break;
    }

    twiml.record({
      // uses POST by default
      recordingStatusCallback: '/api/v1/phone/twilio/record-callback',
    });
    twiml.say({ language: 'de-DE' }, 'Ich habe keine Nachricht empfangen.');

    console.log(body);
    this.callService.createCall({
      callSid: body.CallSid,
      phoneNumber: body.From,
      country: body.FromCountry,
      city: body.FromCity,
      zip: body.FromZip,
    });

    res.type('text/xml');
    res.send(twiml.toString());
  }

  // TODO auth
  @Post('twilio/record-callback')
  async receiveRecording(@Body() body: any): Promise<any> {
    console.log(body);
    this.callService.getAndSaveRecord(body.CallSid, body.RecordingUrl);

    return {
      message: 'Successful',
    };
  }

  // @Get('audio/:language/:file')
  // async serveAudioFile(
  //   @Res() response: any,
  //   @Param() parameters: { language: string; file: string },
  // ) {
  //   response.setHeader('Content-Type', 'audio/mpeg');
  //   response.attachment(parameters.file);
  //   return response.download(
  //     './src/modules/phone/audio/' +
  //       parameters.language +
  //       '/' +
  //       parameters.file,
  //   );
  // }

  @Get('calls')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Returns all calls with the given parameters' })
  @ApiOkResponse({ description: 'Successful', type: Call, isArray: true })
  async getCalls(
    @Query() query: GetCallsQueryParams,
    @ReqUser() user: UserID,
  ): Promise<Call[]> {
    if (query.userId === 'me') {
      query.userId = user.userId;
    }
    return await this.callService.queryCalls(query);
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
    return await this.callService.helpRequestAndUserFromCall(
      sid,
      createHelpRequestDto,
      user.userId,
    );
  }
}
