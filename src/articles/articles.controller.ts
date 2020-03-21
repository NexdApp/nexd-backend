import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Get,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticlesService } from './articles.service';
import { Article } from './article.entity';

@Controller('articles')
@ApiTags('Articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  async insertOne(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'All existing articles',
    type: [Article],
  })
  findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }
}
