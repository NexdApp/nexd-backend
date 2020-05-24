import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from './unit.entity';
import { GetAllUnitsQueryParams } from './dto/get-all-units-query.dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitsRepository: Repository<Unit>,
  ) {}

  async getUnits(query: GetAllUnitsQueryParams): Promise<Unit[]> {
    const sql = this.unitsRepository
      .createQueryBuilder('units')
      .where(query.language ? 'units.language = :language' : '1=1', {
        language: query.language,
      });

    return sql.getMany();
  }
}
