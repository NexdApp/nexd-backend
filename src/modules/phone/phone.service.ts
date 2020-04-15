import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Response } from 'express';

import { Call } from './call.entity';

import { HelpRequestCreateDto } from '../helpRequests/dto/help-request-create.dto';
import { HelpRequestsService } from '../helpRequests/help-requests.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Twilio = require('twilio');

@Injectable()
export class PhoneService {
  private readonly logger = new Logger(PhoneService.name);

  // default number of calls that get returned by database return queries
  readonly DEFAULT_RETURN_AMOUNT: number = 20;

  readonly DEFAULT_MIN_CALL_DURATION = 3;

  /**
   *
   * @param callRepo
   * @param helpRequestRepo
   */
  constructor(
    @InjectRepository(Call)
    private readonly callRepo: Repository<Call>,
    private readonly helpRequestsService: HelpRequestsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Creates new Call object in the database
   *
   * @param callSid
   */
  async createCall(call: {
    callSid: string;
    phoneNumber?: string;
    country?: string;
    city?: string;
    zip?: string;
  }): Promise<string> {
    const newAudioFile = new Call();
    newAudioFile.sid = call.callSid;
    newAudioFile.phoneNumber = call.phoneNumber;
    newAudioFile.country = call.country;
    newAudioFile.city = call.city;
    newAudioFile.zip = call.zip;

    await this.callRepo.save(newAudioFile);
    return newAudioFile.sid;
  }

  /**
   * Returns the Call from the database with the corresponding sid
   *
   * @param callSid
   */
  async getBySid(callSid: string): Promise<Call | undefined> {
    return await this.callRepo.findOne({ sid: callSid });
  }

  /**
   * Returns all calls matching the provided query parameters
   *
   * @param queryParameters
   */
  async queryCalls(queryParameters: {
    limit?: number;
    zip?: string;
    country?: string;
    city?: string;
    converted?: boolean;
    userId?: string;
  }): Promise<Call[]> {
    const query = this.callRepo
      .createQueryBuilder('calls')
      .orderBy('calls.createdAt', 'DESC');

    if (queryParameters.converted == true) {
      query.andWhere('"helpRequests"."callSid" IS NOT NULL');
    } else if (queryParameters.converted == false) {
      query.andWhere('"helpRequests"."callSid" IS NULL');
    }

    // only successful calls
    query.andWhere('calls.recordingUrl IS NOT NULL');

    if (queryParameters.country) {
      query.andWhere('calls.country = :country', {
        country: queryParameters.country,
      });
    }

    if (queryParameters.zip) {
      query.andWhere('calls.zip = :zip', { zip: queryParameters.zip });
    }

    if (queryParameters.city) {
      query.andWhere('calls.city = :city', { city: queryParameters.city });
    }

    if (queryParameters.userId) {
      query.andWhere('calls.converterId = :converterId', {
        converterId: queryParameters.userId,
      });
    }

    if (query.limit) {
      query.limit(queryParameters.limit);
    }

    query.leftJoinAndSelect('calls.convertedHelpRequest', 'helpRequests');
    query.leftJoinAndSelect('calls.converter', 'users');

    return await query.getMany();
  }

  /**
   * Marks an call as recorded and sets the url to the to the audio file
   *
   * @param callSid
   * @param recordingUrl
   */
  async getAndSaveRecord(
    callSid: string,
    recordingUrl: string,
    recordingDuration: string,
  ): Promise<boolean> {
    const call: Call | undefined = await this.callRepo.findOne({
      sid: callSid,
    });

    if (Number(recordingDuration) < this.DEFAULT_MIN_CALL_DURATION) {
      this.logger.warn(`Call ${callSid} was too short `);
      return false;
    }

    if (call) {
      call.recordingUrl = recordingUrl;
      await this.callRepo.save(call);
      return true;
    }
    return false;
  }

  async helpRequestAndUserFromCall(
    callSid: string,
    createHelpRequestDto: HelpRequestCreateDto,
    userId: string,
  ): Promise<Call> {
    const call: Call | undefined = await this.callRepo.findOne({
      sid: callSid,
    });
    if (!call) {
      throw new NotFoundException('Call not found');
    }
    if (call.converter) {
      throw new ConflictException('Call already converted to help request');
    }

    call.converterId = userId;

    if (!createHelpRequestDto.phoneNumber) {
      throw new BadRequestException('Phone number needs to be given for calls');
    }

    // new or existing user by phone number
    let user = await this.usersService.getByPhoneNumber(
      createHelpRequestDto.phoneNumber,
    );

    if (!user) {
      this.logger.log('Create a phoneNumber user');
      user = await this.usersService.create({
        email: null,
        phoneNumber: createHelpRequestDto.phoneNumber,
        password: 'unused',
      });
    }

    // create help request
    const helpRequest = await this.helpRequestsService.create(
      createHelpRequestDto,
      user.id,
    );
    call.convertedHelpRequest = helpRequest;

    return await this.callRepo.save(call);
  }

  handleIncomingCall(
    res: Response,
    body: {
      FromCountry: string;
      CallSid: string;
      From: string;
      FromCity: string;
      FromZip: string;
    },
  ) {
    // TODO: body is not really used, it could also be the CallStatus: completed event
    // TODO: we need to check where a response is needed
    const voiceResponse = new Twilio.twiml.VoiceResponse();

    // TODO language selection, maybe through incoming number
    switch (body.FromCountry) {
      case 'DE':
        voiceResponse.play(
          {
            loop: 1,
          },
          '/api/v1/phone/audio/DE/introduction.mp3',
        );
        break;

      default:
        voiceResponse.say(
          { language: 'en-US' },
          "Welcome to nexd, we don't know your language but we continue with english",
        );
        break;
    }

    voiceResponse.record({
      // uses POST by default
      recordingStatusCallback: '/api/v1/phone/twilio/record-callback',
    });
    voiceResponse.say(
      { language: 'de-DE' },
      'Ich habe keine Nachricht empfangen.',
    );

    this.createCall({
      callSid: body.CallSid,
      phoneNumber: body.From,
      country: body.FromCountry,
      city: body.FromCity,
      zip: body.FromZip,
    });

    res.type('text/xml');
    res.send(voiceResponse.toString());
  }
}
