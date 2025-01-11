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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PaginationDto } from '@/common/dto/pagination.dto';

import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@ApiTags('Collection')
@ApiBearerAuth('JWT-Auth')
@Controller('collections')
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
  async findOne(@Param('id') id: string) {
    const data = await this.collectionsService.findOne(id);
    return { data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    const data = await this.collectionsService.update(id, updateCollectionDto);
    return { data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.collectionsService.remove(id);
    return { data };
  }
}
