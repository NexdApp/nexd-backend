import { Test, TestingModule } from '@nestjs/testing';
import { HelpListsController } from './help-lists.controller';

xdescribe('Shopping List Controller', () => {
  let controller: HelpListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelpListsController],
    }).compile();

    controller = module.get<HelpListsController>(HelpListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
