import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PaginationDto } from '@/common/dto/pagination.dto';
import { Color } from '~/colors/entities/color.entity';
import { Size } from '~/sizes/entities/size.entity';

import { Product } from '../products/entities/product.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoriesService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly InventoryModel: Model<Inventory>,
    @InjectModel(Product.name)
    private readonly ProductModel: Model<Product>,
    @InjectModel(Size.name)
    private readonly SizeModel: Model<Size>,
    @InjectModel(Color.name)
    private readonly ColorModel: Model<Color>,
  ) {}

  async create(body: CreateInventoryDto) {
    const { product, color, size } = body;

    const [existProduct, existSize, existColor] = await Promise.all([
      await this.ProductModel.findById(product),
      await this.SizeModel.findById(size),
      await this.ColorModel.findById(color),
    ]);

    if (!existProduct || !existSize || !existColor) {
      throw new BadRequestException();
    }

    const existInventory = await this.InventoryModel.findOne({
      product,
      color,
      size,
      isDeleted: false,
    });

    if (existInventory) {
      throw new ConflictException();
    }

    const newInventory = await this.InventoryModel.create({
      ...body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return newInventory;
  }

  async findAll(pagination: PaginationDto) {
    const {
      page = 1,
      limit = 1,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = pagination;

    const data = await this.InventoryModel.find({
      isDeleted: false,
    })
      .sort([[sortBy, sortDirection]])
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.InventoryModel.countDocuments({
      isDeleted: false,
    });
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const item = await this.InventoryModel.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!item) {
      throw new NotFoundException();
    }
    return item;
  }

  async update(id: string, body: UpdateInventoryDto) {
    const item = await this.InventoryModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        ...body,
        updatedAt: Date.now(),
      },
      {
        new: true,
      },
    );

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async remove(id: string) {
    const item = await this.InventoryModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
        updatedAt: Date.now(),
      },
    );
    if (!item) {
      throw new NotFoundException();
    }
    return item;
  }
}
