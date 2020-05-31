import { MigrationInterface, QueryRunner } from 'typeorm';
import { UnitsSeed } from '../seed/units.seed';
import { Unit } from 'src/modules/articles/unit.entity';

export class UnitValues1590960420422 implements MigrationInterface {
  name = 'UnitValues1590960420422';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const unitRepo = queryRunner.connection.getRepository(Unit);
    await unitRepo.save(UnitsSeed);
  }

  public async down(): Promise<void> {
    // nothing
  }
}
