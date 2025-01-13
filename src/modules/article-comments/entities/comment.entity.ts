/* eslint-disable @typescript-eslint/no-var-requires */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleCommentDocument = HydratedDocument<ArticleComment>;

@Schema({})
export class ArticleComment {
  @Prop({
    required: true,
    ref: 'Article',
  })
  article: string;

  @Prop({
    required: false,
    ref: 'ArticleComment',
  })
  parent: string;

  @Prop({
    required: false,
    ref: 'ArticleComment',
    autopopulate: {
      match: {
        isDeleted: false,
      },
    },
  })
  replies: string[];

  @Prop({
    required: false,
  })
  content: string;

  @Prop({
    required: false,
    default: 0,
  })
  likeCount: number;

  @Prop({
    required: false,
    ref: 'User',
  })
  likedBy: string[];

  @Prop({
    required: false,
    ref: 'User',
    autopopulate: true,
  })
  createdBy: string;

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

export const ArticleCommentSchema =
  SchemaFactory.createForClass(ArticleComment);
ArticleCommentSchema.plugin(require('mongoose-autopopulate'));
