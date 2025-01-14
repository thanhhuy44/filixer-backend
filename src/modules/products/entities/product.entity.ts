/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({})
export class Product {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  slug: string;

  @Prop({
    required: true,
    ref: 'Asset',
    autopopulate: {
      match: {
        isDeleted: false,
      },
    },
  })
  thumbnails: string[];

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
    ref: 'Size',
  })
  sizes: string[];

  @Prop({
    required: true,
    ref: 'Color',
  })
  colors: string[];

  @Prop({
    required: true,
  })
  inventory: number;

  @Prop({
    required: true,
  })
  price: number;

  @Prop({
    required: true,
  })
  originPrice: number;

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

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(require('mongoose-autopopulate'));
