import { Body, Controller, Get, Post, UseGuards, Put } from '@nestjs/common';
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

  @Post('/articles')
  @ApiOperation({ summary: 'Create an article' })
  @ApiCreatedResponse({ description: 'Created', type: Article })
  async insertOne(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articlesService.createArticle(createArticleDto);
  }

  @Get('/articles')
  @ApiOperation({ summary: 'List articles' })
  @ApiOkResponse({
    description: 'All existing articles',
    type: [Article],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Patch('/articles/:articleId')
  @ApiOperation({ summary: 'Modify article' })
  async updateArticle(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articlesService.updateArticle(createArticleDto);
  }

  @Post('/units')
  @ApiOperation({ summary: 'Create a unit' })
  async createUnit(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @Get('/units')
  @ApiOperation({ summary: 'Get a list of units' })
  async getUnits(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @Put('/units/:unitId')
  @ApiOperation({ summary: 'Add a unit' })
  async updateUnit(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @Post('/categories')
  @ApiOperation({ summary: 'Create a category' })
  async createCategory(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @Get('/categories')
  @ApiOperation({ summary: 'Create a category' })
  async getCategories(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @Put('/categories/:categoryId')
  @ApiOperation({ summary: 'Create a category' })
  async updateCategory(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }
}
