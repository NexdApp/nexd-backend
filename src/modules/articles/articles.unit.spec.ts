import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Repository } from 'typeorm';
import { Article } from './article.entity';

describe('Articles Controller', () => {
  let service: ArticlesService;
  let controller: ArticlesController;
  let repository: Repository<Article>;

  beforeEach(async () => {
    service = new ArticlesService(repository);
    controller = new ArticlesController(service);
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      const result = [{ id: 1, name: 'test' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });
});
