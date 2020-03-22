import {Test, TestingModule} from '@nestjs/testing';
import {ShoppingListController} from './shopping-list.controller';

describe('Shopping List Controller', () => {
  let controller: ShoppingListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingListController],
    }).compile();

    controller = module.get<ShoppingListController>(ShoppingListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
