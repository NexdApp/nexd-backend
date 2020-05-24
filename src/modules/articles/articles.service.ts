import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './article.entity';
import { GetAllArticlesQueryParams } from './dto/get-all-articles-query.dto';
import { ArticleStatus } from './article-status';

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
      .where(
        query.onlyVerified !== false ? 'articles.status = :status' : '1=1',
        {
          status: ArticleStatus.VERIFIED,
        },
      )
      .andWhere(query.startsWith ? 'articles.name ilike :name' : '1=1', {
        name: query.startsWith + '%',
      })
      .andWhere(query.language ? 'articles.language = :language' : '1=1', {
        language: query.language,
      });

    if (query.limit) {
      sql.limit(query.limit);
    }

    return sql.getMany();
  }

  async remove(id: string): Promise<void> {
    await this.articlesRepository.delete(id);
  }

  // async updateArticle(updateArticleDto: UpdateArticleDto): Promise<Article> {}
}
