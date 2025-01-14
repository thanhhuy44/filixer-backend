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

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Product')
@ApiBearerAuth('JWT-Auth')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() body: CreateProductDto) {
    const data = await this.productsService.create(body);
    return { data };
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    const data = await this.productsService.findAll(query);
    return data;
  }

  @Get('info/:slug')
  async getInfo(@Param('slug') slug: string) {
    const data = await this.productsService.getInfo(slug);
    return { data };
  }

  @Get('inventories/:id')
  async getInventories(@Param() params: MongoIdDto) {
    const { id } = params;
    const data = await this.productsService.getInventories(id);
    return { data };
  }

  @Get(':id')
  async findOne(@Param() param: MongoIdDto) {
    const { id } = param;
    const data = await this.productsService.findOne(id);
    return { data };
  }

  @Patch(':id')
  async update(
    @Param() param: MongoIdDto,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const { id } = param;
    const data = await this.productsService.update(id, updateProductDto);
    return { data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.productsService.remove(id);
    return { data };
  }
}
