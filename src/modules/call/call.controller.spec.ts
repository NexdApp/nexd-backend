import { Test, TestingModule } from '@nestjs/testing';
import { CallController } from './call.controller';

describe('Call Controller', () => {
  let controller: CallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallController],
    }).compile();

    controller = module.get<CallController>(CallController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
