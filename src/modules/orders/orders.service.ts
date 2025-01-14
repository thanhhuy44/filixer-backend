import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PaginationDto } from '@/common/dto/pagination.dto';
import { EOrderStatus } from '@/types/enum';
import { Inventory } from '~/inventories/entities/inventory.entity';
import { Product } from '~/products/entities/product.entity';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly OrderModel: Model<Order>,
    @InjectModel(OrderItem.name)
    private readonly OrderItemModel: Model<OrderItem>,
    @InjectModel(Product.name)
    private readonly ProductModel: Model<Product>,
    @InjectModel(Inventory.name)
    private readonly InventoryModel: Model<Inventory>,
  ) {}
  async create(body: CreateOrderDto) {
    const { orderProducts } = body;

    for (let index = 0; index < orderProducts.length; index++) {
      const element = orderProducts[index];
      await this.checkIsInStock(element.variant, element.amount);
    }

    const savedOrderProducts = await this.OrderItemModel.create([
      ...orderProducts,
    ]);

    const newOrder = await this.OrderModel.create({
      ...body,
      orderProducts: savedOrderProducts.map((item) => item._id),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    for (let index = 0; index < orderProducts.length; index++) {
      const element = orderProducts[index];
      await this.adjustAmountVariant(element.variant, element.amount);
    }

    return newOrder;
  }

  private async checkIsInStock(id: string, amount: number) {
    const variant = await this.InventoryModel.findById(id);
    if (!variant) {
      throw new NotFoundException(`Variant not found: ${id}`);
    }
    const isInStock = variant.amount >= amount;

    if (!isInStock) {
      throw new BadRequestException(`Variant out of stock: ${id}`);
    }

    return isInStock;
  }

  private async adjustAmountVariant(id: string, amount: number) {
    const variant = await this.InventoryModel.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!variant) {
      throw new NotFoundException(`Variant not found: ${id}`);
    }
    const product = await this.ProductModel.findOne({
      _id: variant.product,
      isDeleted: false,
    });
    if (!product) {
      throw new NotFoundException(`product not found: ${variant.product}`);
    }
    await this.InventoryModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $inc: {
          amount: -amount,
        },
      },
    );
    await this.ProductModel.findOneAndUpdate(
      {
        _id: variant.product,
        isDeleted: false,
      },
      {
        $inc: {
          inventory: -amount,
        },
      },
    );
  }

  async findAll(pagination: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = pagination;
    const data = await this.OrderModel.find({
      isDeleted: false,
    })
      .sort([[sortBy, sortDirection]])
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await this.OrderModel.countDocuments({ isDeleted: false });
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.OrderModel.findById(id);
    if (!order) {
      throw new NotFoundException();
    }
    return order;
  }

  async cancel(id: string) {
    const updatedOrder = await this.OrderModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
        $or: [
          {
            status: EOrderStatus.PROCESSING,
          },
          {
            status: EOrderStatus.APPROVED,
          },
        ],
      },
      {
        status: EOrderStatus.CANCEL,
        updatedAt: Date.now(),
      },
      {
        new: true,
      },
    );
    if (!updatedOrder) {
      throw new NotFoundException();
    }
    for (let index = 0; index < updatedOrder.orderProducts.length; index++) {
      const element = updatedOrder.orderProducts[index] as any;
      await this.adjustAmountVariant(element.variant, -element.amount);
    }

    return updatedOrder;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
