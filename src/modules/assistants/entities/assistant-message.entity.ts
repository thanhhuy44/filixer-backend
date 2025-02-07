import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { EAssistantRole } from '@/types/enum';

export type AssistantMessageDocument = HydratedDocument<AssistantMessage>;

@Schema({})
export class AssistantMessage {
  @Prop({
    required: true,
    ref: 'AssistantRoom',
  })
  room: string;

  @Prop({
    required: true,
    enum: EAssistantRole,
  })
  role: string;

  @Prop({
    required: true,
  })
  content: string;

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

export const AssistantMessageSchema =
  SchemaFactory.createForClass(AssistantMessage);
