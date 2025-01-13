import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MongoIdDto } from '@/common/dto/mongo-params.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Category')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const data = await this.categoriesService.create(createCategoryDto);
    return { data };
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    return await this.categoriesService.findAll(pagination);
  }

  @Get('detail/:slug')
  async findOneBySlug(@Param('slug') slug: string) {
    const data = await this.categoriesService.findOneBySlug(slug);
    return { data };
  }

  @Get(':id/articles')
  async getArticles(
    @Param() params: MongoIdDto,
    @Query() pagination: PaginationDto,
  ) {
    const data = await this.categoriesService.getArtices(params.id, pagination);
    return data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.categoriesService.findOne(id);
    return { data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const data = await this.categoriesService.update(id, updateCategoryDto);
    return { data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.categoriesService.remove(id);
    return { data };
  }
}
