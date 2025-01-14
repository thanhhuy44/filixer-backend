import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ESizeType } from '@/types/enum';

export type SizeDocument = HydratedDocument<Size>;

@Schema({})
export class Size {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    enum: ESizeType,
  })
  type: string;

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

export const SizeSchema = SchemaFactory.createForClass(Size);
