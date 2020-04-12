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
  Query,
} from '@nestjs/common';
import {
  ApiParam,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiExcludeEndpoint,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

const VoiceResponse = require('twilio').twiml.VoiceResponse;
import { PhoneService } from './phone.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Call } from './call.entity';
import { ConvertedHelpRequestDto } from './dto/converted-help-request.dto';
import {
  CountryHotlineNumbers,
  countryHotlineNumberExample,
} from './interfaces/CountryHotlineNumbers.interface';

@Controller('phone')
@ApiTags('Phone')
export class PhoneController {
  constructor(private readonly callService: PhoneService) { }

  @Get('numbers')
  @ApiOperation({ summary: 'Returns available numbers' })
  @ApiOkResponse({
    description: 'Success',
    content: {
      'applicaton/json': {
        schema: {
          type: 'string',
          format: 'json',
          example: JSON.stringify(countryHotlineNumberExample),
        },
      },
    },
  })
  async getNumber(): Promise<CountryHotlineNumbers> {
    return countryHotlineNumberExample;
  }

  @Post('twilio/call')
  @ApiExcludeEndpoint()
  async incomingCall(@Res() res: any, @Body() body: any): Promise<any> {
    const twiml: any = new VoiceResponse();

    switch (body.FromCountry) {
      case 'DE':
        twiml.play({
          loop: 1,
        }, "/api/v1/phone/audio/DE/introduction.mp3");
        break;

      default:
        twiml.say(
          { language: 'en-US' },
          'Welcome to nexd, we don\'t know your language but we continue with english'
        );
        break;
    }

    twiml.record({
      action: '/api/v1/phone/twilio/recorded',
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
  @ApiExcludeEndpoint()
  async receiveRecording(@Body() body: any): Promise<any> {
    this.callService.recorded(body.CallSid, body.RecordingUrl);

    return {
      message: 'Successful',
    };
  }

  @Get('audio/:language/:file')
  async serveAudioFile(@Res() response: any, @Param() parameters: { language: string, file: string }) {
    response.setHeader('Content-Type', 'audio/mpeg')
    response.attachment(parameters.file)
    return response.download("./src/modules/phone/audio/" + parameters.language + "/" + parameters.file);
  }

  @Get('calls')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Returns all calls with the given parameters' })
  @ApiOkResponse({ description: 'Successful', type: Call, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'converted',
    required: false,
    description:
      'True if you only want to query calls which are already converted to a ' +
      'help request, false otherwise. Returns all calls if undefined.',
  })
  @ApiQuery({
    name: 'country',
    required: false,
  })
  @ApiQuery({
    name: 'zip',
    required: false,
  })
  @ApiQuery({
    name: 'city',
    required: false,
  })
  async calls(
    @Query('limit') limit: number,
    @Query('converted') converted: string,
    @Query('country') country: string,
    @Query('zip') zip: number,
    @Query('city') city: string,
  ): Promise<any> {
    if (
      converted !== 'true' &&
      converted !== 'false' &&
      converted !== undefined
    ) {
      throw new HttpException(
        'Wrong converted query parameter',
        HttpStatus.BAD_REQUEST,
      );
    }

    const body = {
      limit: limit,
      converted: converted,
      country: country,
      zip: zip,
      city: city,
    };

    return await this.callService.queryCalls(body);
  }

  @Put('calls/:sid/converted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sets a call as converted to shopping list' })
  @ApiOkResponse({ description: 'Successful', type: Call })
  @ApiNotFoundResponse({ description: "Couldn't find call or help request" })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({
    name: 'sid',
    description: 'call sid',
    type: 'string',
  })
  async converted(
    @Param('sid') sid: string,
    @Body() convertedHelpRequest: ConvertedHelpRequestDto,
  ): Promise<any> {
    const call: Call = await this.callService.converted(
      sid,
      convertedHelpRequest.helpRequestId,
    );

    return call;
  }

  @Get('calls/:sid/record')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Redirects the request to the stored record file.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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
