import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Call } from './call.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { HelpRequest } from '../helpRequests/help-request.entity';
import { HelpRequestCreateDto } from '../helpRequests/dto/help-request-create.dto';
import { HelpRequestsService } from '../helpRequests/help-requests.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PhoneService {
  // default number of calls that get returned by database return queries
  readonly DEFAULT_RETURN_AMOUNT: number = 20;

  /**
   *
   * @param callRepo
   * @param helpRequestRepo
   */
  constructor(
    @InjectRepository(Call)
    private readonly callRepo: Repository<Call>,
    @InjectRepository(HelpRequest)
    private readonly helpRequestRepo: Repository<HelpRequest>,
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
      query.andWhere('calls.convertedHelpRequest IS NOT NULL');
    } else if (queryParameters.converted == false) {
      query.andWhere('calls.convertedHelpRequest IS NULL');
    }

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
  ): Promise<boolean> {
    const call: Call | undefined = await this.callRepo.findOne({
      sid: callSid,
    });

    if (call) {
      call.recordUrl = recordingUrl;
      await this.callRepo.save(call);
      return true;
    }
    return false;
  }

  /**
   * Returns the url to the record of the call with the specific
   *
   * @param callSid
   */
  async getCallRecord(callSid: string): Promise<string | undefined> {
    const call: Call | undefined = await this.callRepo
      .createQueryBuilder()
      .select('Call.recordUrl')
      .where('Call.sid = :sid', { sid: callSid })
      .getOne();

    return call?.recordUrl;
  }

  /**
   * Marks an call as recorded and sets the url to the to the audio file
   *
   * @param callSid
   * @param helpRequest
   */
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
    if (call.converterId) {
      throw new ConflictException('Call already converted to help request');
    }

    // requesting user converted
    call.converterId = userId;

    if (!createHelpRequestDto.phoneNumber) {
      throw new BadRequestException('Phone number needs to be given for calls');
    }

    // new or existing user by phone number
    let user = await this.usersService.getByPhoneNumber(
      createHelpRequestDto.phoneNumber,
    );

    if (!user) {
      user = await this.usersService.create({
        email: null,
        phoneNumber: createHelpRequestDto.phoneNumber,
        password: 'unused', // TODO disable user
      });
    }
    console.log(user);

    // create help request
    const helpRequest = await this.helpRequestsService.create(
      createHelpRequestDto,
      user.id,
    );
    call.convertedHelpRequest = helpRequest;

    return await this.callRepo.save(call);
  }
}
