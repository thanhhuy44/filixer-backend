/* eslint-disable @typescript-eslint/no-var-requires */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { EChatMessageType } from '@/types/enum';

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

class Reaction {
  @Prop({ ref: 'User', required: true })
  user: string; // User who reacted

  @Prop({ required: true })
  emoji: string; // Emoji reaction
}

@Schema({})
export class ChatMessage {
  @Prop({
    required: true,
    ref: 'ChatRoom',
  })
  room: string;

  @Prop({
    required: false,
  })
  text: string;

  @Prop({
    required: false,
    ref: 'Assets',
    autopopulate: true,
  })
  images: string;

  @Prop({
    required: false,
    ref: 'Assets',
    autopopulate: true,
  })
  files: string;

  @Prop({
    required: false,
    type: Reaction,
  })
  reactions: Reaction[];

  @Prop({
    required: true,
    ref: 'User',
  })
  sender: string;

  @Prop({
    required: true,
    enum: EChatMessageType,
    default: EChatMessageType.TEXT,
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

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
ChatMessageSchema.plugin(require('mongoose-autopopulate'));
