import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InventoryDocument = HydratedDocument<Inventory>;

@Schema({})
export class Inventory {
  @Prop({
    required: true,
    ref: 'Product',
  })
  product: string;

  @Prop({
    required: true,
    ref: 'Size',
  })
  size: string;

  @Prop({
    required: true,
    ref: 'Color',
  })
  color: string;

  @Prop({
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    required: true,
    min: 0,
  })
  amount: number;

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

export const InventorySchema = SchemaFactory.createForClass(Inventory);
