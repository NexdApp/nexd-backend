import { Injectable, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AudioFile } from './audio-storage.entity';
import { Repository } from 'typeorm';
import { S3, config } from 'aws-sdk';
import { ConfigService } from '../config/config.service';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';

const s3 = new S3();

@Injectable()
export class AudioStorageService {
  constructor(
    @InjectRepository(AudioFile)
    private readonly audioRepo: Repository<AudioFile>,
    private readonly configService: ConfigService,
  ) {
    config.update({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async uploadToAWS(
    @Req() req: any,
    @Res() res: any,
    audioFile: AudioFile,
  ): Promise<any> {
    try {
      this.upload(req, res, (error: string) => {
        if (error) {
          console.log(error);
          return res.status(400).json(`Upload failed: ${error}`);
        }

        audioFile.path = req.files[0].location;
        audioFile.uploaded = new Date();
        audioFile.isUploaded = true;
        this.audioRepo.save(audioFile);

        return res.status(201).json('Upload successful');
      });
    } catch (error) {
      return res.status(400).json(`Upload failed: ${error}`);
    }
  }

  async getById(id: number): Promise<any> {
    return await this.audioRepo.findOne({ id });
  }

  async create(): Promise<any> {
    const newAudioFile = await this.audioRepo.create();
    await this.audioRepo.save(newAudioFile);
    return newAudioFile.id;
  }

  async setTranslated(translated: boolean, id: number): Promise<any> {
    const audioFile = await this.getById(id);

    if (audioFile) {
      audioFile.translated = true;
      this.audioRepo.save(audioFile);
      return true;
    } else {
      return false;
    }
  }

  async getLastCalls(amount: number){
    const audioFiles: AudioFile[] = await this.audioRepo.createQueryBuilder()
                                      .orderBy("AudioFile.uploaded", "DESC")
                                      .where("AudioFile.isUploaded = true")
                                      .limit(amount)
                                      .getMany();

    return audioFiles;
  }

  upload = multer({
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
}
