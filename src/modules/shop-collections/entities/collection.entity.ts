/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<ShopCollection>;

@Schema({})
export class ShopCollection {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  slug: string;

  @Prop({
    required: true,
    ref: 'Asset',
    autopopulate: true,
  })
  thumbnail: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
    ref: 'Product',
    autopopulate: true,
  })
  products: string[];

  @Prop({
    required: false,
    default: false,
  })
  isPopular: boolean;

  @Prop({
    required: true,
    default: false,
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

export const ShopCollectionSchema =
  SchemaFactory.createForClass(ShopCollection);
ShopCollectionSchema.plugin(require('mongoose-autopopulate'));
