import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

import { PaginationDto } from '@/common/dto/pagination.dto';
import { RawQuery } from '@/types';
import { ESortDirection } from '@/types/enum';
import { Article } from '~/articles/entities/article.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ArticleComment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(ArticleComment.name)
    private readonly CommentModel: Model<ArticleComment>,
    @InjectModel(Article.name) private readonly ArticleModel: Model<Article>,
  ) {}
  async create(body: CreateCommentDto, createdBy: string) {
    let parentComment: Document<Comment>;

    const existArticle = await this.ArticleModel.findOne({
      _id: body.article,
      isDeleted: false,
    });
    if (!existArticle) {
      throw new NotFoundException('Article not found!');
    }
    if (body.parent) {
      parentComment = await this.CommentModel.findOne({
        _id: body.parent,
        isDeleted: false,
      });
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found!');
      }
    }
    const data = await this.CommentModel.create({
      ...body,
      createdBy,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    if (parentComment) {
      await this.CommentModel.findByIdAndUpdate(parentComment._id, {
        $push: {
          replies: data._id,
        },
      });
    }
    return data;
  }

  async findAll(pagination: PaginationDto, queries: RawQuery) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortDirection = ESortDirection.DESC,
    } = pagination;
    const filter = { ...queries, isDeleted: false };
    const data = await this.CommentModel.find(filter)
      .sort([[sortBy, sortDirection]])
      .populate('createdBy')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.CommentModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    return { data, pagination: { page, limit, total, totalPages } };
  }

  async findOne(id: string) {
    return `This action returns a #${id} comment`;
  }

  async like(id: string, user: string) {
    const comment = await this.CommentModel.findById(id);
    if (!comment) {
      throw new NotFoundException('Not found comment!');
    }
    const isLiked = comment.likedBy.includes(user);
    const update = isLiked
      ? {
          $pull: { likedBy: user }, // Remove the item
          $inc: { likeCount: -1 }, // Decrement the counter
        }
      : {
          $addToSet: { likedBy: user }, // Add the item if not present
          $inc: { likeCount: 1 }, // Increment the counter
        };
    const updatedComment = await this.CommentModel.findByIdAndUpdate(
      id,
      update,
      { new: true },
    );
    return updatedComment;
  }

  async update(id: string, author: string, body: UpdateCommentDto) {
    const editComment = await this.CommentModel.findOneAndUpdate(
      {
        _id: id,
        createdBy: author,
      },
      {
        ...body,
        updatedAt: Date.now(),
      },
      { new: true },
    );
    return editComment;
  }

  async remove(id: string, createdBy: string) {
    const deletedComment = await this.CommentModel.findByIdAndUpdate(
      {
        _id: id,
        createdBy,
      },
      { isDeleted: true, updatedAt: Date.now() },
    );
    if (!deletedComment) {
      throw new NotFoundException();
    }
    await this.CommentModel.updateMany(
      {
        replies: deletedComment.replies,
        parent: deletedComment._id,
      },
      {
        isDeleted: true,
        updatedAt: Date.now(),
      },
    );
    return deletedComment._id;
  }
}
