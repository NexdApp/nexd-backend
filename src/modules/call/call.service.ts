import { Injectable, Req, Res } from '@nestjs/common';
import { Repository, QueryBuilder } from 'typeorm';
import { Call } from './call.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '../config/config.service';

import { S3, config } from 'aws-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import { CallQueryDto } from './dto/callQueryDto.dt';
import { LocalInfoService } from 'modules/local-info/local-info.service';

const s3 = new S3();

@Injectable()
export class CallService {
  // number of calls that get returned by database return querries 
  readonly DEFAULT_RETURN_AMOUNT: number = 20;

  /**
   * 
   * @param callRepo 
   * @param configService 
   */
  constructor(@InjectRepository(Call)
  private readonly callRepo: Repository<Call>,
  private readonly localInfoService: LocalInfoService,
  private readonly configService: ConfigService){
    config.update({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  /**
   * Creates new Call object in the database 
   * 
   * @param call_sid 
   */
  async create( call_sid: string, 
                phone_number?: string,
                country?: string,
                city?: string,
                zip?: number
                ): Promise<string>{

    console.log(city);

    const localInfo = await this.localInfoService.getLocalInfo(city = "Breisach am Rhein")

    console.log(localInfo)

    const newAudioFile = await this.callRepo.create({ sid : call_sid,
                                                      phone_number : phone_number || "",
                                                      country: country || localInfo?.country || "",
                                                      city: city || localInfo?.city || "",
                                                      zip: zip || 0});
    await this.callRepo.save(newAudioFile);
    return newAudioFile.sid;
  }

  /**
   * Returns the Call from the database with the corresponding sid
   * 
   * @param call_sid 
   */
  async getBySid(call_sid: string): Promise<Call | undefined> {
    return await this.callRepo.findOne({ sid: call_sid });
  }

  /**
   * Returns all calls matching the provided query parameters
   * 
   * @param queryParameters 
   */
  async queryCalls(queryParameters: CallQueryDto): Promise<Call[]>{
    let query = this.callRepo.createQueryBuilder().orderBy("Call.created", "DESC");

    if(queryParameters.converted)
      query.andWhere("Call.converted = :conversion_state", {conversion_state: queryParameters.converted})

    if(queryParameters.country)
      query.andWhere("Call.country = :country", {country: queryParameters.country})

    if(queryParameters.zip)
      query.andWhere("Call.zip = :zip", {zip : queryParameters.zip})

    if(queryParameters.city)
      query.andWhere("Call.city = :city", {city : queryParameters.city})

    
    query.limit(queryParameters.amount ? queryParameters.amount : this.DEFAULT_RETURN_AMOUNT)

    return await query.getMany();
  }

/**
 * Returns the url to the record of the call with the specific 
 * 
 * @param call_sid 
 */
async getCallRecord(call_sid: string): Promise<string | undefined>{
  let call: Call | undefined = await this.callRepo.createQueryBuilder().select("Call.record_url")
                                                  .where("Call.sid = :sid", {sid: call_sid})
                                                  .getOne();

  return call?.record_url;
}

/**
 * Returns the url to the transcription of the call with the specific 
 * 
 * @param call_sid 
 */
async getCallTranscription(call_sid: string): Promise<string | undefined>{
  let call: Call | undefined = await this.callRepo.createQueryBuilder().select("Call.transcription_url")
                                                  .where("Call.sid = :sid", {sid: call_sid})
                                                  .getOne();

  return call?.transcription_url;
}


 /**
  * Marks the call with the corresponding sid as translated and sets the path to the translation 
  * 
  * @param call_sid 
  * @param transcription_url 
  */
  async transcribed(call_sid: string, transcription_url: string): Promise<boolean>{
    let call : Call | undefined = await this.callRepo.findOne({ sid : call_sid })

    if (call){
      call.transcribed = true;
      call.transcription_url = transcription_url;
      this.callRepo.save(call);
      return true;
    }
    return false;
  }

  /**
   * Marks an call as recorded and sets the url to the to the audio file
   * 
   * @param call_sid 
   * @param recording_url 
   */
  async recorded(call_sid: string, recording_url: string): Promise<boolean>{
    let call : Call | undefined = await this.callRepo.findOne({ sid : call_sid })

    if (call){
      call.recorded = true;
      call.record_url = recording_url;
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
  async converted(call_sid: string): Promise<boolean>{
    let call : Call | undefined = await this.callRepo.findOne({ sid : call_sid })

    if (call){
      call.converted = true;
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
  async uploadRecordToAWS(
    @Req() req: any,
    @Res() res: any,
    call: Call,
  ): Promise<any> {
    try {
      this.uploadAudio(req, res, (error: string) => {
        if (error) {
          return res.status(400).json(`Upload failed: ${error}`);
        }

        call.record_url = req.files[0].location;
        call.recorded = true;
        this.callRepo.save(call);

        return res.status(201).json('Upload successful');
      });
    } catch (error) {
      return res.status(400).json(`Upload failed: ${error}`);
    }
  }


  /**
   * Redirects an form-data request with file upload data to a AWS Bucket
   */
  uploadAudio = multer({
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
  }).array('upload', 1);


  uploadText = multer({
    storage: multerS3({
      s3,
      bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      acl: 'public-read',
      key(request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
    fileFilter: (request, file, cb) => {
      if (file.mimetype === 'text/plain' ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('File format error'));
      }
    },
  }).array('upload', 1);

}
