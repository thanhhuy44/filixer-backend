/* eslint-disable @typescript-eslint/no-var-requires */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { EOrderStatus, EPaymentMethod } from '@/types/enum';

export type OrderDocument = HydratedDocument<Order>;

@Schema({})
export class Order {
  @Prop({
    required: true,
    ref: 'OrderItem',
    autopopulate: true,
  })
  orderProducts: string[];

  @Prop({
    required: true,
  })
  totalPrice: number;

  @Prop({
    required: false,
  })
  user: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  phoneNumber: string;

  @Prop({
    required: true,
  })
  recipientName: string;

  @Prop({
    required: true,
    default: 'Viet Nam',
  })
  country: string;

  @Prop({
    required: true,
  })
  province: string;

  @Prop({
    required: true,
  })
  district: string;

  @Prop({
    required: true,
  })
  wardOrCommune: string;

  @Prop({
    required: false,
  })
  address: string;

  @Prop({
    required: false,
  })
  shippingNote: string;

  @Prop({
    required: true,
    enum: EOrderStatus,
    default: EOrderStatus.PROCESSING,
  })
  status: string;

  @Prop({
    required: true,
    enum: EPaymentMethod,
    default: EPaymentMethod.COD,
  })
  paymentMethod: string;

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

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.plugin(require('mongoose-autopopulate'));
