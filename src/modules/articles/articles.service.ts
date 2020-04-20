import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
  ) {}

  async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
    // check if already present
    const articleInDb = await this.articlesRepository.findOne({
      where: {
        name: createArticleDto.name,
        language: createArticleDto.language,
      },
    });
    if (articleInDb) {
      return articleInDb;
    }

    const article = new Article();
    article.name = createArticleDto.name;
    article.language = createArticleDto.language;

    return this.articlesRepository.save(article);
  }

  async updateArticle(updateArticleDto: UpdateArticleDto): Promise<Article> {}

  async findAll(): Promise<Article[]> {
    return this.articlesRepository.find();
  }

  async remove(id: string): Promise<void> {
    await this.articlesRepository.delete(id);
  }
}
