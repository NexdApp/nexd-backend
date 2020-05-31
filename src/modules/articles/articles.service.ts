import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './article.entity';
import { GetAllArticlesQueryParams } from './dto/get-all-articles-query.dto';
import { ArticleStatus } from './article-status';
import { Cron } from '@nestjs/schedule';
import { ConfigurationService } from '../../configuration/configuration.service';
import { HelpRequestArticle } from '../helpRequests/help-request-article.entity';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
    private readonly configService: ConfigurationService,
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
      .andWhere(query.contains ? 'articles.name ilike :name' : '1=1', {
        name: `%${query.contains}%`,
      })
      .andWhere(query.language ? 'articles.language = :language' : '1=1', {
        language: query.language,
      });

    if (query.orderByPopularity) {
      sql.orderBy('articles.popularity', 'DESC');
    }

    if (query.limit) {
      sql.limit(query.limit);
    }

    return sql.getMany();
  }

  async remove(id: string): Promise<void> {
    await this.articlesRepository.delete(id);
  }

  /**
   * Articles have an ordered list of units, this cron calculates them
   */
  @Cron('50 */30 * * * *')
  async updateArticleUnits() {
    this.logger.log('Build the article unit order');

    // get a grouping of article/unit combinations
    const result = await getConnection()
      .createQueryBuilder()
      .select(
        'COUNT(helpRequestArticle.id) AS cnt, helpRequestArticle.articleId, helpRequestArticle.unitId',
      )
      .from(HelpRequestArticle, 'helpRequestArticle')
      .groupBy('helpRequestArticle.articleId')
      .addGroupBy('helpRequestArticle.unitId')
      .getRawMany();

    // group units for each article
    const articleUnitList = result.reduce((acc, curr) => {
      const artId = curr.articleId;
      if (acc[artId]) {
        acc[artId] = [...acc[artId], curr];
      } else {
        acc[artId] = [curr];
      }
      return acc;
    }, {});

    const sortFn = (a: any, b: any) => (a.cnt < b.cnt ? 1 : -1);

    // sort units by count and keep only the order
    const sortedArticles = Object.entries(articleUnitList).map(
      ([articleId, val]: [string, any]) => {
        const sortedUnits = val
          .sort(sortFn)
          .map(entry => entry.unitId)
          .filter(Number);
        return [articleId, sortedUnits];
      },
    );

    // transform to postgres array string
    const sortedArticlesString = sortedArticles
      .filter(row => row[1].length > 0) // only used articles
      .map(row => `(${row[0]}, array${JSON.stringify(row[1])})`);

    if (sortedArticlesString.length <= 0) {
      this.logger.log('No articles found to be evaluated. Abort.');
      return;
    }

    const sqlUpdate = await getConnection().query(`
      update articles as a set
        "unitIdOrder" = "helper"."unitIdOrder"
      from (
        values
          ${sortedArticlesString.join(',')}
      )
      as helper("id", "unitIdOrder")
      where helper.id = a.id;
    `);

    this.logger.log(`Unit order set for ${sqlUpdate[1]} articles`);
  }

  /**
   * Article status changes to verified, after a certain frequency of usage
   */
  @Cron('30 */1 * * * *')
  async updateArticleStatus() {
    const neededForVerification = Number(
      this.configService.get('ARTICLE_REQUIRED_FOR_VERIFICATION') || 10,
    );
    this.logger.log(
      `Update article status and ranking, verified with ${neededForVerification} entries`,
    );

    // get a grouping of article/unit combinations
    const result = await getConnection()
      .createQueryBuilder()
      .select(
        'COUNT(helpRequestArticle.id) AS cnt, helpRequestArticle.articleId',
      )
      .from(HelpRequestArticle, 'helpRequestArticle')
      .groupBy('helpRequestArticle.articleId')
      .getRawMany();

    if (result.length <= 0) {
      this.logger.log('No articles found at all. Abort.');
      return;
    }

    // backwards from less popular to popular
    const sortFn = (a: any, b: any) => (a.cnt < b.cnt ? -1 : 1);

    const resultParsed = result.map(row => {
      row.cnt = parseInt(row.cnt);
      return row;
    });
    const sortedCounts = resultParsed.sort(sortFn);

    const countArray = sortedCounts.map(
      (row, index) => `(${row.articleId}, ${index})`,
    );

    const updatePopularity = await getConnection().query(`
      update articles as a set
        "popularity" = helper.popularity
      from (
        values
          ${countArray.join(',')}
      )
      as helper("id", "popularity")
      where helper.id = a.id;
    `);

    this.logger.log(`Updated popularity: ${updatePopularity[1]}`);

    const evaluatedCounts = resultParsed.filter(
      article => article.cnt >= neededForVerification,
    );

    if (evaluatedCounts.length <= 0) {
      this.logger.log('No used articles found to be evaluated. Abort.');
      return;
    }

    const statusArray = evaluatedCounts.map(
      row => `(${row.articleId}, 'verified'::articles_status_enum)`,
    );

    // syntax is overkill, but taken from unit order update
    // a simple where would be enough, but this is consistent and
    // enables for more status later
    const update = await getConnection().query(`
      update articles as a set
        "status" = helper.status
      from (
        values
          ${statusArray.join(',')}
      )
      as helper("id", "status")
      where helper.id = a.id and "a"."statusOverwritten" = false;
    `);
    this.logger.log(`Verified articles: ${update[1]}`);
  }
}
