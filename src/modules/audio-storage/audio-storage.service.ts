import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AudioFile } from './audio-storage.entity';
import { Repository } from 'typeorm';

const PATH_PREFIX = "./data/"


@Injectable()
export class AudioStorageService {
    constructor(
        @InjectRepository(AudioFile)
        private readonly audioRepo: Repository<AudioFile>
      ) {}

    async getById(id: number){
        return await this.audioRepo.findOne({ id })
    }

    async create(){
        const newUser = this.audioRepo.create(payload);
    }
}
