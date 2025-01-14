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

import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Controller('colors')
@ApiTags('Color')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  async create(@Body() body: CreateColorDto) {
    const data = await this.colorsService.create(body);
    return { data };
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const data = await this.colorsService.findAll(pagination);
    return data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.colorsService.findOne(id);
    return { data };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateColorDto) {
    const data = await this.colorsService.update(id, body);
    return { data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.colorsService.remove(id);

    return { data };
  }
}
