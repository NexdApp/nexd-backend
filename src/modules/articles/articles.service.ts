import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './article.entity';
import { GetAllArticlesQueryParams } from './dto/get-all-articles-query.dto';

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

  async findAll(query: GetAllArticlesQueryParams): Promise<Article[]> {
    const sql = this.articlesRepository
      .createQueryBuilder('articles')
      .where('articles.activated = :activated', { activated: true });

    if (query.startsWith) {
      // ILIKE added soon: https://github.com/typeorm/typeorm/pull/5828
      sql.andWhere('articles.name like :name', {
        name: query.startsWith + '%',
      });
      // TODO checks
    }

    if (query.language) {
      sql.andWhere('articles.language = :language', {
        language: query.language,
      });
    }

    if (query.limit) {
      sql.limit(query.limit);
    }

    return await sql.getMany();
  }

  async remove(id: string): Promise<void> {
    await this.articlesRepository.delete(id);
  }

  // async updateArticle(updateArticleDto: UpdateArticleDto): Promise<Article> {}
}
