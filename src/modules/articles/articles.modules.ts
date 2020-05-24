import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ConfigurationModule } from '../../configuration/configuration.module';
import { UnitsService } from './units.service';
import { Unit } from './unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Unit]), ConfigurationModule],
  providers: [ArticlesService, UnitsService],
  controllers: [ArticlesController],
  exports: [ArticlesService],
})
export class ArticlesModule {}
