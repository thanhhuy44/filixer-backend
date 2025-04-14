import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PaginationDto } from '@/common/dto/pagination.dto';
import { RawQuery } from '@/types';
import { ESortDirection } from '@/types/enum';
import { convertToSlug } from '@/utils/helpers';
import { Article } from '~/articles/entities/article.entity';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ArticleCategory } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(ArticleCategory.name)
    private readonly CategoryModel: Model<ArticleCategory>,
    @InjectModel(Article.name) private readonly ArticleModel: Model<Article>,
  ) {}

  async create(body: CreateCategoryDto) {
    const slug = convertToSlug(body.name);
    const existCategory = await this.CategoryModel.findOne({
      name: body.name,
      slug,
      isDeleted: false,
    });
    if (existCategory) {
      throw new ConflictException('Category is exist!');
    }
    const newCategory = await this.CategoryModel.create({
      ...body,
      slug,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return newCategory;
  }

  async findAll(pagination: PaginationDto, queries: RawQuery) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortDirection = ESortDirection.DESC,
    } = pagination;
    const data = await this.CategoryModel.find({ isDeleted: false, ...queries })
      .sort([[sortBy, sortDirection]])
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.CategoryModel.countDocuments({
      isDeleted: false,
      ...queries,
    });
    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const data = await this.CategoryModel.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  async findOneBySlug(slug: string) {
    const info = await this.CategoryModel.findOne({ slug, isDeleted: false });
    if (!info) {
      throw new NotFoundException();
    }
    return info;
  }

  async getArtices(id: string, pagination: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortDirection = ESortDirection.DESC,
    } = pagination;
    const data = await this.ArticleModel.find({
      categories: id,
      isDeleted: false,
    })
      .sort([[sortBy, sortDirection]])
      .populate(['author', 'categories', 'thumbnail'])
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.ArticleModel.countDocuments({
      categories: id,
      isDeleted: false,
    });
    const totalPages = Math.ceil(total / limit);

    return { data, pagination: { page, limit, total, totalPages } };
  }

  async update(id: string, body: UpdateCategoryDto) {
    let slug: string;
    if (body?.name) {
      const category = await this.CategoryModel.findOne({
        name: body.name,
        slug,
        isDeleted: false,
      });
      if (category && category._id.toString() !== id) {
        throw new ConflictException();
      }
    }
    const updatedCategory = await this.CategoryModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        ...body,
        slug,
        isDeleted: false,
        updatedAt: Date.now(),
      },
      {
        new: true,
      },
    );

    if (!updatedCategory) {
      throw new NotFoundException();
    }

    return updatedCategory;
  }

  async remove(id: string) {
    const removedCategory = await this.CategoryModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isDeleted: true,
        updatedAt: Date.now(),
      },
    );
    if (!removedCategory) {
      throw new NotFoundException();
    }
    return removedCategory._id;
  }
}
