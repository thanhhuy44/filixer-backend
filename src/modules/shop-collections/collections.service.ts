import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PaginationDto } from '@/common/dto/pagination.dto';
import { convertToSlug } from '@/utils/helpers';

import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { ShopCollection } from './entities/collection.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(ShopCollection.name)
    private readonly CollectionModel: Model<ShopCollection>,
  ) {}

  async create(body: CreateCollectionDto) {
    const slug = convertToSlug(body.name);
    const existCollection = await this.CollectionModel.findOne({ slug });
    if (existCollection) {
      throw new ConflictException('Collection is exist!');
    }
    const newCollection = await this.CollectionModel.create({
      ...body,
      slug,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return newCollection;
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const collections = await this.CollectionModel.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.CollectionModel.countDocuments();
    return {
      data: collections,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total,
      },
    };
  }

  async findOne(id: string) {
    const collection =
      await this.CollectionModel.findById(id).populate('products');
    if (!collection) {
      throw new NotFoundException();
    }
    return collection;
  }

  async findOneBySlug(slug: string) {
    const collection = await this.CollectionModel.findOne({
      slug,
      isDeleted: false,
    });
    if (!collection) {
      throw new NotFoundException();
    }
    return collection;
  }

  async update(id: string, body: UpdateCollectionDto) {
    let slug: string | undefined;
    if (body.name) {
      slug = convertToSlug(body.name);
    }
    const updateBody = { ...body, slug, updatedAt: Date.now() };
    const updatedCollection = await this.CollectionModel.findByIdAndUpdate(
      id,
      {
        ...updateBody,
      },
      {
        new: true,
      },
    );
    if (!updatedCollection) {
      throw new NotFoundException();
    }
    return updatedCollection;
  }

  async remove(id: string) {
    const removedCollection = await this.CollectionModel.findByIdAndDelete(id);
    if (!removedCollection) {
      throw new NotFoundException();
    }
    return removedCollection._id;
  }
}
