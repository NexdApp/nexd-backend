import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Put,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticlesService } from './articles.service';
import { Article } from './article.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('articles')
@ApiTags('Articles')
@UseGuards(JwtAuthGuard)
@ApiBadRequestResponse({ description: 'Bad Request' })
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({ summary: 'Create an article' })
  @ApiCreatedResponse({ description: 'Created', type: Article })
  async insertOne(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: 'List articles' })
  @ApiOkResponse({
    description: 'All existing articles',
    type: [Article],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Patch(':articleId')
  @ApiOperation({ summary: 'Modify article' })
  async updateArticle(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }
}
