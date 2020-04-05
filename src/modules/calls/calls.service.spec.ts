import { Test, TestingModule } from '@nestjs/testing';
import { CallsService } from './calls.service';

describe('CallsService', () => {
  let service: CallsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CallsService],
    }).compile();

    service = module.get<CallsService>(CallsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
