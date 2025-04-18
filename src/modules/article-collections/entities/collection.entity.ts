import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleCollectionDocument = HydratedDocument<ArticleCollection>;

@Schema({})
export class ArticleCollection {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  slug: string;

  @Prop({
    required: false,
    ref: 'Asset',
  })
  thumbnail: string;

  @Prop({
    required: false,
  })
  description: string;

  @Prop({
    required: false,
    ref: 'Article',
  })
  articles: string[];

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

export const ArticleCollectionSchema =
  SchemaFactory.createForClass(ArticleCollection);
