/* eslint-disable @typescript-eslint/no-var-requires */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { EArticleStatus } from '@/types/enum';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({})
export class Article {
  @Prop({
    required: true,
    index: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  slug: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
    ref: 'Asset',
  })
  thumbnail: string;

  @Prop({
    required: true,
    ref: 'User',
    autopopulate: true,
  })
  author: string;

  @Prop({
    required: true,
    ref: 'Category',
  })
  categories: string[];

  @Prop({
    required: true,
    select: false,
  })
  content: string;

  @Prop({
    required: false,
  })
  keywords: string[];

  @Prop({
    required: true,
    default: 0,
  })
  viewCount: number;

  @Prop({
    required: true,
    default: 0,
  })
  likeCount: number;

  @Prop({
    required: true,
    default: 0,
  })
  commentCount: number;

  @Prop({
    required: true,
    ref: 'User',
  })
  likedBy: string[];

  @Prop({
    required: true,
    default: false,
  })
  isTrending: boolean;

  @Prop({
    required: true,
    default: false,
  })
  isRecommend: boolean;

  @Prop({
    required: true,
    default: false,
  })
  isPick: boolean;

  @Prop({
    required: true,
    default: false,
  })
  isTop: boolean;

  @Prop({
    required: true,
    default: EArticleStatus.IN_REVIEW,
    enum: EArticleStatus,
  })
  status: string;

  @Prop({
    required: true,
    default: false,
    select: false,
  })
  isDeleted: boolean;

  @Prop({
    required: true,
    default: Date.now(),
  })
  createdAt: Date;

  @Prop({
    required: true,
    default: Date.now(),
  })
  updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
ArticleSchema.plugin(require('mongoose-autopopulate'));
