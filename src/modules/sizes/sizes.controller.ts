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

import { PaginationDto } from '@/common/dto/pagination.dto';

import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { SizesService } from './sizes.service';

@Controller('sizes')
@ApiTags('Size')
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @Post()
  async create(@Body() body: CreateSizeDto) {
    const data = await this.sizesService.create(body);
    return { data };
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const data = await this.sizesService.findAll(pagination);
    return data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.sizesService.findOne(id);
    return data;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateSizeDto) {
    return this.sizesService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.sizesService.remove(id);
    return { data };
  }
}
