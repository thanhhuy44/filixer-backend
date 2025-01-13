import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';

import { PaginationDto } from '@/common/dto/pagination.dto';
import { ESortDirection } from '@/types/enum';

import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { ArticleCollection } from './entities/collection.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(ArticleCollection.name)
    private readonly CollectionModel: Model<ArticleCollection>,
  ) {}

  async create(body: CreateCollectionDto) {
    const slug = slugify(body.name, {
      lower: true,
    });
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
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortDirection = ESortDirection.DESC,
    } = pagination;
    const data = await this.CollectionModel.find({ isDeleted: false })
      .sort([[sortBy, sortDirection]])
      .populate(['thumbnail'])
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.CollectionModel.countDocuments({
      isDeleted: false,
    });
    const totalPages = Math.ceil(total / limit);
    return { data, pagination: { page, limit, total, totalPages } };
  }

  async findOne(id: string) {
    const data = await this.CollectionModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $inc: {
          viewCount: 1,
        },
      },
      {
        new: true,
      },
    ).populate([
      'thumbnail',
      {
        path: 'articles',
        populate: {
          path: 'thumbnail',
        },
      },
    ]);
    if (!data) {
      throw new NotFoundException('Not found!');
    }
    return data;
  }

  async update(id: string, body: UpdateCollectionDto) {
    let slug: string;
    if (body.name) {
      slug = slugify(body.name, {
        lower: true,
      });
      const existArticle = await this.CollectionModel.findOne({ slug });
      if (existArticle && existArticle._id.toString() !== id) {
        throw new ConflictException();
      }
    }
    const updatedArticle = await this.CollectionModel.findByIdAndUpdate(
      id,
      {
        ...body,
        slug,
        updatedAt: Date.now(),
      },
      { new: true },
    );
    return updatedArticle;
  }

  async remove(id: string) {
    const removedArticle = await this.CollectionModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isDeleted: true,
        updatedAt: Date.now(),
      },
    );
    if (!removedArticle) {
      throw new NotFoundException();
    }
    return removedArticle._id;
  }
}
