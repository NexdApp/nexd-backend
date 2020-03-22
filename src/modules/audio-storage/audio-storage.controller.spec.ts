import { Test, TestingModule } from '@nestjs/testing';
import { AudioStorageController } from './audio-storage.controller';

describe('AudioStorage Controller', () => {
  let controller: AudioStorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AudioStorageController],
    }).compile();

    controller = module.get<AudioStorageController>(AudioStorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
