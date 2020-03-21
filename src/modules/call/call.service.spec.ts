import { Test, TestingModule } from '@nestjs/testing';
import { CallService } from './call.service';

describe('CallService', () => {
  let service: CallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CallService],
    }).compile();

    service = module.get<CallService>(CallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
