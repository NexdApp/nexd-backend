import { MigrationInterface, QueryRunner } from 'typeorm';
import { UnitsSeed } from '../seed/units.seed';
import { Unit } from 'src/modules/articles/unit.entity';

export class UnitValues1590330721595 implements MigrationInterface {
  name = 'UnitValues1590330721595';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.commitTransaction();
    const unitRepo = queryRunner.connection.getRepository(Unit);
    await unitRepo.save(UnitsSeed);
  }

  public async down(): Promise<void> {
    // nothing
  }
}
