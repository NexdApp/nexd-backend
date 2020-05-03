import { Factory, Seeder } from 'typeorm-seeding';
import { Article } from '../modules/articles/article.entity';
import { Connection } from 'typeorm';
export class ArticleSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Article)
      .values([{ name: 'article' }])
      .execute();
  }
}
