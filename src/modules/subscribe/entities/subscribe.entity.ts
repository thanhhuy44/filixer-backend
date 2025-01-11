import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { SubscribeStatus } from '@/types/enum';

export type SubscribeDocument = HydratedDocument<Subscribe>;

@Schema({})
export class Subscribe {
  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
    default: SubscribeStatus.ACTIVE,
    enum: SubscribeStatus,
  })
  status: SubscribeStatus;

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

export const SubscribeSchema = SchemaFactory.createForClass(Subscribe);
