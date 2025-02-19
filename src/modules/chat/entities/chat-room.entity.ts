/* eslint-disable @typescript-eslint/no-var-requires */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { EChatRoomType } from '@/types/enum';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

class RoomMember {
  @Prop({
    required: true,
    ref: 'User',
    autopopulate: true,
  })
  user: string;

  @Prop({
    required: false,
  })
  nickname: string;
}

@Schema({})
export class ChatRoom {
  @Prop({
    required: true,
    type: [RoomMember],
  })
  members: RoomMember[];

  @Prop({
    required: false,
  })
  name: string;

  @Prop({
    required: true,
    enum: EChatRoomType,
  })
  type: EChatRoomType;

  @Prop({
    required: true,
    ref: 'User',
  })
  deletedBy: string[];

  @Prop({
    required: true,
    ref: 'User',
  })
  createdBy: string;

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

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
ChatRoomSchema.plugin(require('mongoose-autopopulate'));
