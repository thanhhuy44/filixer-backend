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

import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@ApiTags('Shop Collection')
@Controller('shop-collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  async create(@Body() createCollectionDto: CreateCollectionDto) {
    const data = await this.collectionsService.create(createCollectionDto);
    return { data };
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const data = await this.collectionsService.findAll(pagination);
    return data;
  }

  @Get(':id')
  async findOne(@Param() params: MongoIdDto) {
    const data = await this.collectionsService.findOne(params.id);
    return { data };
  }

  @Get('info/:slug')
  async findOneBySlug(@Param('slug') slug: string) {
    const data = await this.collectionsService.findOneBySlug(slug);
    return { data };
  }

  @Patch(':id')
  async update(@Param() params: MongoIdDto, @Body() body: UpdateCollectionDto) {
    const data = await this.collectionsService.update(params.id, body);
    return { data };
  }

  @Delete(':id')
  async remove(@Param() params: MongoIdDto) {
    const data = await this.collectionsService.remove(params.id);
    return { data };
  }
}
