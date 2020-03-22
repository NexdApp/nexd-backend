import { Test, TestingModule } from '@nestjs/testing';
import { AudioStorageService } from './audio-storage.service';

describe('AudioStorageService', () => {
  let service: AudioStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AudioStorageService],
    }).compile();

    service = module.get<AudioStorageService>(AudioStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
