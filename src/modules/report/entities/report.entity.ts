/* eslint-disable @typescript-eslint/no-var-requires */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ReportTargetType } from '@/types/enum';

export type ReportDocument = HydratedDocument<Report>;

@Schema({})
export class Report {
  @Prop({
    required: true,
  })
  target: string;

  @Prop({
    required: true,
  })
  reason: string;

  @Prop({
    required: true,
    enum: ReportTargetType,
  })
  targetType: string;

  @Prop({
    required: true,
    ref: 'User',
    autopopulate: true,
  })
  createdBy: string;

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

export const ReportSchema = SchemaFactory.createForClass(Report);
ReportSchema.plugin(require('mongoose-autopopulate'));
