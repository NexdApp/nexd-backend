import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ConfigurationModule } from 'src/configuration/configuration.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), ConfigurationModule],
  providers: [ArticlesService],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
