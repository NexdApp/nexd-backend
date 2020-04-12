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

// import { S3, config } from 'aws-sdk';
//import * as multer from 'multer';
//import * as multerS3 from 'multer-s3';
import { HelpRequest } from '../helpRequests/help-request.entity';
import { HelpRequestCreateDto } from '../helpRequests/dto/help-request-create.dto';
import { HelpRequestsService } from '../helpRequests/help-requests.service';
import { UsersService } from '../users/users.service';
//import * as twilio from 'twilio';

// const s3 = new S3();
/* config.update({
  accessKeyId: prossess.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}); */

@Injectable()
export class PhoneService {
  // default number of calls that get returned by database return querries
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
  async create(
    callSid: string,
    phoneNumber?: string,
    country?: string,
    city?: string,
    zip?: string,
  ): Promise<string> {
    const newAudioFile = await this.callRepo.create({
      sid: callSid,
      phoneNumber: phoneNumber || '',
      country: country || '',
      city: city || '',
      zip: zip || '',
    });
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

    if (queryParameters.converted) {
      query.andWhere('calls.convertedHelpRequest IS NOT NULL');
    } else if (queryParameters.converted) {
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

    query.limit(
      queryParameters.limit
        ? queryParameters.limit
        : this.DEFAULT_RETURN_AMOUNT,
    );

    query.leftJoinAndSelect('calls.convertedHelpRequest', 'helpRequests');

    return await query.getMany();
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
   * Returns the url to the transcription of the call with the specific
   *
   * @param callSid
   */
  async getCallTranscription(callSid: string): Promise<string | undefined> {
    const call: Call | undefined = await this.callRepo
      .createQueryBuilder()
      .select('Call.transcriptionUrl')
      .where('Call.sid = :sid', { sid: callSid })
      .getOne();

    return call?.transcriptionUrl;
  }

  /**
   * Marks the call with the corresponding sid as translated and sets the path to the translation
   *
   * @param callSid
   * @param transcriptionUrl
   */
  async transcribed(
    callSid: string,
    transcriptionUrl: string,
  ): Promise<boolean> {
    const call: Call | undefined = await this.callRepo.findOne({
      sid: callSid,
    });

    if (call) {
      call.transcriptionUrl = transcriptionUrl;
      this.callRepo.save(call);
      return true;
    }
    return false;
  }

  /**
   * Marks an call as recorded and sets the url to the to the audio file
   *
   * @param callSid
   * @param recordingUrl
   */
  async recorded(callSid: string, recordingUrl: string): Promise<boolean> {
    const call: Call | undefined = await this.callRepo.findOne({
      sid: callSid,
    });

    if (call) {
      call.recordUrl = recordingUrl;
      this.callRepo.save(call);
      return true;
    }
    return false;
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

  /**
   * @deprecated
   * Marks the call with the corresponding sid as translated and sets the path to the translation
   *
   * @param call_sid
   * @param transcription_url
   */
  async converted(callSid: string, helpRequestId: number): Promise<Call> {
    const call: Call | undefined = await this.callRepo.findOne(
      {
        sid: callSid,
      },
      { relations: ['convertedHelpRequest'] },
    );

    if (call.convertedHelpRequest) {
      throw new HttpException('Call already converted', HttpStatus.BAD_REQUEST);
    }

    const helpRequest:
      | HelpRequest
      | undefined = await this.helpRequestRepo.findOne(helpRequestId);

    if (call && helpRequest) {
      call.convertedHelpRequest = helpRequest;
      this.callRepo.save(call);

      return call;
    }

    throw new HttpException(
      'Call or help request not found',
      HttpStatus.NOT_FOUND,
    );
  }

  /**
   * Redirects incoming request containing a file to an AWS S3 Bucket
   *
   * @param req
   * @param res
   * @param call
   */
  /* async uploadRecordToAWS(
    @Req() req: any,
    @Res() res: any,
    call: Call,
  ): Promise<any> {
    try {
      this.uploadAudio(req, res, (error: string) => {
        if (error) {
          return res.status(400).json(`Upload failed: ${error}`);
        }

        call.recordUrl = req.files[0].location;
        call.recorded = true;
        this.callRepo.save(call);

        return res.status(201).json('Upload successful');
      });
    } catch (error) {
      return res.status(400).json(`Upload failed: ${error}`);
    }
  } */

  /**
   * Redirects an form-data request with file upload data to a AWS Bucket
   */
  /* uploadAudio = multer({
    storage: multerS3({
      s3,
      bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      acl: 'public-read',
      key(request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
    fileFilter: (request, file, cb) => {
      if (
        file.mimetype === 'audio/mpeg' ||
        file.mimetype === 'audio/ogg' ||
        file.mimetype === 'audio/wav' ||
        file.mimetype === 'audio/mp4'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('File format error'));
      }
    },
  }).array('upload', 1); */

  /* uploadText = multer({
    storage: multerS3({
      s3,
      bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      acl: 'public-read',
      key(request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
    fileFilter: (request, file, cb) => {
      if (file.mimetype === 'text/plain') {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('File format error'));
      }
    },
  }).array('upload', 1); */
}
