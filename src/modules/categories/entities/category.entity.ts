import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({})
export class Category {
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
  })
  description: string;

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

export const CategorySchema = SchemaFactory.createForClass(Category);
