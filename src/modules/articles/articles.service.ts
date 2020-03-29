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

  create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = new Article();
    article.name = createArticleDto.name;

    return this.articlesRepository.save(article);
  }

  async findAll(): Promise<Article[]> {
    return this.articlesRepository.find();
  }

  async remove(id: string): Promise<void> {
    await this.articlesRepository.delete(id);
  }
}
