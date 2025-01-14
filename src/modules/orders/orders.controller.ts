import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MongoIdDto } from '@/common/dto/mongo-params.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('Order')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const data = await this.ordersService.create(createOrderDto);
    return { data };
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const data = await this.ordersService.findAll(pagination);
    return data;
  }

  @Get(':id')
  async findOne(@Param() params: MongoIdDto) {
    const { id } = params;
    const data = await this.ordersService.findOne(id);
    return { data };
  }

  @Patch(':id/cancel')
  async cancel(@Param() params: MongoIdDto) {
    const { id } = params;
    const data = await this.ordersService.cancel(id);
    return { data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return this.ordersService.remove(id);
  // }
}
