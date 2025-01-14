/* eslint-disable @typescript-eslint/no-var-requires */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderItemDocument = HydratedDocument<OrderItem>;

@Schema({})
export class OrderItem {
  @Prop({
    required: true,
    ref: 'Product',
    autopopulate: true,
  })
  product: string;

  @Prop({
    required: true,
    ref: 'Inventory',
    autopopulate: true,
  })
  variant: string;

  @Prop({
    required: true,
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

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
OrderItemSchema.plugin(require('mongoose-autopopulate'));
