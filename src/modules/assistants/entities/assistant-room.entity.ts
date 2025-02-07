import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AssistantRoomDocument = HydratedDocument<AssistantRoom>;

@Schema({})
export class AssistantRoom {
  @Prop({
    required: true,
    ref: 'User',
  })
  user: string;

  @Prop({
    required: true,
  })
  name: string;

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

export const AssistantRoomSchema = SchemaFactory.createForClass(AssistantRoom);
