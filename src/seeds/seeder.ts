import { getConnection } from 'typeorm';
import { Article } from '../modules/articles/article.entity';
// this seeder was made to manually seed db from typeorm connection
// can be run by npm run seed_manual:run
async function seeder() {
  const connection = getConnection();
  await connection
    .createQueryBuilder()
    .insert()
    .into(Article)
    .values([{ name: 'article2' }])
    .execute();
}
seeder();
