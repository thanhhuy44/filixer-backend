import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import slugify from 'slugify';

import { PaginationDto } from '@/common/dto/pagination.dto';
import { Inventory } from '~/inventories/entities/inventory.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly ProductModel: Model<Product>,
    @InjectModel(Inventory.name)
    private readonly InventoryModel: Model<Inventory>,
  ) {}
  async create(body: CreateProductDto) {
    const slug = slugify(body.name, {
      lower: true,
    });
    const existProductName = await this.ProductModel.findOne({
      slug,
      isDeleted: false,
    });

    if (existProductName) {
      throw new ConflictException();
    }

    const newProduct = await this.ProductModel.create({
      ...body,
      slug,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    await this.InventoryModel.create(
      body.variants.map((variant) => ({ ...variant, product: newProduct._id })),
    );

    return newProduct;
  }

  async findAll(query: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = query;
    const data = await this.ProductModel.find({
      isDeleted: false,
    })
      .sort([[sortBy, sortDirection]])
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await this.ProductModel.countDocuments({ isDeleted: false });
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

  async getInfo(slug: string) {
    const product = await this.ProductModel.findOne({
      slug,
      isDeleted: false,
    }).populate(['colors', 'sizes']);
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  async findOne(id: string) {
    const product = await this.ProductModel.findOne({
      _id: id,
      isDeleted: false,
    }).populate(['colors', 'sizes']);
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  async getInventories(product: string) {
    const inventories = await this.InventoryModel.find({
      product,
      isDeleted: false,
    }).populate(['color', 'size']);
    return inventories;
  }

  async update(id: string, body: UpdateProductDto) {
    if (!body.name) {
      const updatedProduct = await this.ProductModel.findOneAndUpdate(
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
      if (!updatedProduct) {
        throw new NotFoundException();
      }
      return updatedProduct;
    }
    const slug = slugify(body.name);
    const existProductName = await this.ProductModel.findOne({
      slug,
      isDeleted: false,
      _id: {
        $ne: new mongoose.Types.ObjectId(id),
      },
    });
    if (existProductName) {
      throw new ConflictException();
    }
    const updatedProduct = await this.ProductModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        ...body,
        slug,
        updatedAt: Date.now(),
      },
      {
        new: true,
      },
    );
    if (!updatedProduct) {
      throw new NotFoundException();
    }
    if (body.variants?.length) {
      await Promise.all(
        body.variants.map((variant) =>
          this.InventoryModel.findOneAndUpdate(
            {
              color: variant.color,
              size: variant.size,
              product: updatedProduct._id,
            },
            {
              price: variant.price,
              color: variant.color,
            },
          ),
        ),
      );
    }
    return updatedProduct;
  }

  async remove(id: string) {
    const deletedProduct = await this.ProductModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
        updatedAt: Date.now(),
      },
      {
        new: true,
      },
    );
    if (!deletedProduct) {
      throw new NotFoundException();
    }
    return deletedProduct._id;
  }
}
