import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { MongoIdDto } from '@/common/dto/mongo-params.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { SearchDto } from './dto/search.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('Article')
@ApiBearerAuth('JWT-Auth')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  async create(@Req() req: Request, @Body() body: CreateArticleDto) {
    const author = req.user._id;
    const data = await this.articlesService.create(body, author);
    return { data };
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const data = this.articlesService.findAll(pagination);
    return data;
  }

  @Get('search')
  async search(@Query() query: SearchDto) {
    const data = await this.articlesService.search(query);
    return { data };
  }

  @Get('detail/:slug')
  async findOneBySlug(@Param('slug') slug: string) {
    const data = await this.articlesService.findOneBySlug(slug);
    return { data };
  }

  @Get('author/:id')
  async getAuthorArticles(
    @Param('id') id: string,
    @Query() pagination: PaginationDto,
  ) {
    const data = await this.articlesService.getAuthorArticles(id, pagination);
    return data;
  }

  @Get(':id/comments')
  async getCommentBySlug(
    @Param() params: MongoIdDto,
    @Query() pagination: PaginationDto,
  ) {
    const data = await this.articlesService.getComments(params.id, pagination);
    return data;
  }

  @Get(':id')
  async findOne(@Param() params: MongoIdDto) {
    const data = await this.articlesService.findOne(params.id);
    return { data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const data = await this.articlesService.update(id, updateArticleDto);
    return { data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.articlesService.remove(id);
    return { data };
  }
}
