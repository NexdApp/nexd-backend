import { Test, TestingModule } from '@nestjs/testing';
import { LocalInfoController } from './local-info.controller';

describe('LocalInfo Controller', () => {
  let controller: LocalInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalInfoController],
    }).compile();

    controller = module.get<LocalInfoController>(LocalInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
