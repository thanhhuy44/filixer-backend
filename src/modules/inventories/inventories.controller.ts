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

import { MongoIdDto } from '@/common/dto/mongo-params.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoriesService } from './inventories.service';

@ApiTags('Inventory')
@ApiBearerAuth('JWT-Auth')
@Controller('inventories')
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @Post()
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    const data = await this.inventoriesService.create(createInventoryDto);
    return { data };
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const data = await this.inventoriesService.findAll(pagination);
    return data;
  }

  @Get(':id')
  async findOne(@Param() param: MongoIdDto) {
    const { id } = param;
    const data = await this.inventoriesService.findOne(id);
    return { data };
  }

  @Patch(':id')
  async update(
    @Param() param: MongoIdDto,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    const { id } = param;
    const data = await this.inventoriesService.update(id, updateInventoryDto);
    return { data };
  }

  @Delete(':id')
  async remove(@Param() param: MongoIdDto) {
    const { id } = param;
    const data = await this.inventoriesService.remove(id);
    return { data };
  }
}
