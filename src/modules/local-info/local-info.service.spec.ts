import { Test, TestingModule } from '@nestjs/testing';
import { LocalInfoService } from './local-info.service';

describe('LocalInfoService', () => {
  let service: LocalInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalInfoService],
    }).compile();

    service = module.get<LocalInfoService>(LocalInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
