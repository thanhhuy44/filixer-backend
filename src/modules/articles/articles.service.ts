import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PaginationDto } from '@/common/dto/pagination.dto';
import { EArticleStatus, ESortDirection } from '@/types/enum';
import { convertToSlug } from '@/utils/helpers';
import { ArticleCategory } from '~/article-categories/entities/category.entity';
import { ArticleCollection } from '~/article-collections/entities/collection.entity';
import { ArticleComment } from '~/article-comments/entities/comment.entity';

import { CreateArticleDto } from './dto/create-article.dto';
import { SearchDto } from './dto/search.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(ArticleCategory.name)
    private readonly CategoryModel: Model<ArticleCategory>,
    @InjectModel(ArticleComment.name)
    private readonly CommentModel: Model<ArticleComment>,
    @InjectModel(Article.name) private readonly ArticleModel: Model<Article>,
    @InjectModel('ArticleCollection')
    private readonly ArticleCollectionModel: Model<ArticleCollection>,
  ) {}

  async create(body: CreateArticleDto, author: string) {
    const slug = convertToSlug(body.title);
    const existArticle = await this.ArticleModel.findOne({ slug });
    if (existArticle) {
      throw new ConflictException();
    }
    const article = await this.ArticleModel.create({
      slug,
      author,
      ...body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return article;
  }

  async findAll(pagination: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortDirection = ESortDirection.DESC,
    } = pagination;
    const data = await this.ArticleModel.find({ isDeleted: false })
      .sort([[sortBy, sortDirection]])
      .populate(['categories', 'author', 'thumbnail'])
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.ArticleModel.countDocuments({ isDeleted: false });
    const totalPages = Math.ceil(total / limit);
    return { data, pagination: { page, limit, total, totalPages } };
  }

  async findOne(id: string) {
    const data = await this.ArticleModel.findOneAndUpdate(
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
    )
      .populate(['categories', 'author', 'thumbnail'])
      .select(['content', 'title', 'description']);
    return data;
  }

  async findOneBySlug(slug: string) {
    const data = await this.ArticleModel.findOne({
      slug: slug,
      isDeleted: false,
    })
      .populate(['categories', 'author', 'thumbnail'])
      .select({
        content: 1,
        title: 1,
        description: 1,
      });
    if (!data) {
      throw new NotFoundException();
    }

    return data;
  }

  async getComments(article: string, pagination: PaginationDto) {
    const {
      page,
      limit,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = pagination;
    const data = await this.CommentModel.find({
      article,
      parent: undefined,
      isDeleted: false,
    })
      .populate([
        {
          path: 'replies',
          match: {
            isDeleted: false,
          },
        },
      ])
      .sort([[sortBy, sortDirection]])
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.CommentModel.countDocuments({
      article,
      parent: undefined,
      isDeleted: false,
    });
    const totalPages = Math.ceil(total / limit);
    return { data, pagination: { page, limit, total, totalPages } };
  }

  async update(id: string, body: UpdateArticleDto) {
    let slug: string;
    if (body.title) {
      slug = convertToSlug(body.title);
      const existArticle = await this.ArticleModel.findOne({ slug });
      if (existArticle && existArticle._id.toString() !== id) {
        throw new ConflictException();
      }
    }
    const updatedArticle = await this.ArticleModel.findByIdAndUpdate(
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
    const removedArticle = await this.ArticleModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        status: EArticleStatus.DELETED,
        isDeleted: true,
        updatedAt: Date.now(),
      },
      {
        new: true,
      },
    );
    if (!removedArticle) {
      throw new NotFoundException();
    }
    const removedId = removedArticle._id.toString();
    await this.ArticleCollectionModel.updateMany(
      { articles: removedId },
      { $pull: { articles: removedId } },
    );
    return removedId;
  }

  async search(query: SearchDto) {
    const {
      keyword,
      limit = 10,
      page = 1,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = query;
    if (!keyword) {
      throw new BadRequestException('Missing keyword');
    }
    const search = new RegExp(keyword, 'i');
    const [articles, total] = await Promise.all([
      this.ArticleModel.find({
        $or: [{ title: search }, { description: search }, { content: search }],
        status: EArticleStatus.PUBLIC,
        isDeleted: false,
      })
        .sort([[sortBy, sortDirection]])
        .populate(['categories', 'thumbnail', 'author'])
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.ArticleModel.countDocuments({
        $or: [{ title: search }, { description: search }, { content: search }],
      }),
    ]);
    return {
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAuthorArticles(id: string, pagination: PaginationDto) {
    const {
      limit = 10,
      page = 1,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = pagination;
    const [articles, total] = await Promise.all([
      this.ArticleModel.find({
        author: id,
        isDeleted: false,
        status: EArticleStatus.PUBLIC,
      })
        .sort([[sortBy, sortDirection]])
        .populate(['categories', 'thumbnail', 'author'])
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.ArticleModel.countDocuments({
        author: id,
        isDeleted: false,
        status: EArticleStatus.PUBLIC,
      }),
    ]);

    return {
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
