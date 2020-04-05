import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Call } from './call.entity';
import { InjectRepository } from '@nestjs/typeorm';

// import { S3, config } from 'aws-sdk';
//import * as multer from 'multer';
//import * as multerS3 from 'multer-s3';
import { CallQueryDto } from './dto/call-query.dto';
import { HelpRequest } from '../helpRequests/help-request.entity';
//import * as twilio from 'twilio';

// const s3 = new S3();
/* config.update({
  accessKeyId: prossess.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}); */

@Injectable()
export class CallsService {
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
  async queryCalls(queryParameters: CallQueryDto): Promise<Call[]> {
    const query = this.callRepo
      .createQueryBuilder()
      .orderBy('Call.created', 'DESC');

    if (queryParameters.converted)
      query.andWhere('Call.converted = :conversionState', {
        conversionState: queryParameters.converted,
      });

    if (queryParameters.country)
      query.andWhere('Call.country = :country', {
        country: queryParameters.country,
      });

    if (queryParameters.zip)
      query.andWhere('Call.zip = :zip', { zip: queryParameters.zip });

    if (queryParameters.city)
      query.andWhere('Call.city = :city', { city: queryParameters.city });

    query.limit(
      queryParameters.amount
        ? queryParameters.amount
        : this.DEFAULT_RETURN_AMOUNT,
    );

    query.leftJoinAndSelect('Call.convertedHelpRequest', 'helpRequests');

    const calls = await query.getMany();
    console.log(calls);

    return await calls;
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
   * Marks the call with the corresponding sid as translated and sets the path to the translation
   *
   * @param call_sid
   * @param transcription_url
   */
  async converted(callSid: string, helpRequestId: number): Promise<boolean> {
    const call: Call | undefined = await this.callRepo.findOne({
      sid: callSid,
    });
    const helpRequest:
      | HelpRequest
      | undefined = await this.helpRequestRepo.findOne(helpRequestId);

    if (call && helpRequest) {
      call.convertedHelpRequest = helpRequest;
      this.callRepo.save(call);

      return true;
    }

    return false;
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
