import { DatabaseTest } from './database-test';
import { TestFixtures } from './fixtures/test.fixtures';

(async () => {
  try {
    const db = new DatabaseTest(
      await DatabaseTest.createConnectionDB({ logging: 'all' }),
      {
        ...TestFixtures,
      },
    );
    await db.reload();
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error);
  }
})();
