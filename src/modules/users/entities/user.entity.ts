/* eslint-disable @typescript-eslint/no-var-requires */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { HydratedDocument } from 'mongoose';

import { EUserRole } from '@/types/enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  toJSON: {
    transform: (doc: UserDocument, user: User) => {
      delete user.password;
      return user;
    },
  },
})
export class User {
  @Prop({
    required: true,
  })
  fullName: string;

  @Prop({
    required: true,
    default: '67483a6676bd4e8c615243a0',
    ref: 'Asset',
    autopopulate: true,
  })
  avatar: string;

  @Prop({
    required: false,
    ref: 'Asset',
    autopopulate: true,
  })
  coverPicture: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: false,
  })
  phoneNumber: string;

  @Prop({
    required: false,
  })
  bio: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    required: true,
    default: EUserRole.USER,
    enum: EUserRole,
  })
  role: string;

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

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(require('mongoose-autopopulate'));

// Pre-save hook for password hashing
UserSchema.pre('save', async function (next) {
  const user = this as User;
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    user.password = await bcrypt.hash(user.password, salt); // Hash password
    next();
  } catch (error) {
    next(error);
  }
});
