import { Factory, Seeder } from 'typeorm-seeding';
import { Article } from '../modules/articles/article.entity';
import { Connection } from 'typeorm';
export class ArticleSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    let articles: { name: string }[] = [];
    for (let i = 1; i <= 10; i++) {
      articles.push({ name: 'article_' + i });
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(Article)
      .values(articles)
      .execute();
  }
}
