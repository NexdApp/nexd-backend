import { Test, TestingModule } from '@nestjs/testing';
import { LocationInfosService } from './locationInfos.service';

describe('LocalInfosService', () => {
  let service: LocationInfosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationInfosService],
    }).compile();

    service = module.get<LocationInfosService>(LocationInfosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
