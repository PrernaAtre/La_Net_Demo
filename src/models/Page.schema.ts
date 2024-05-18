import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true
})

export class Page {
  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ default: 'Untitled Page' })
  name: string;

  @Prop({ type: String })
  document: string;

  @Prop({ type: String, default: '' })
  coverImage: string;

  @Prop({ type: Boolean, default: false })
  isTrashed: boolean;

  @Prop({ type: Types.ObjectId})
  publishId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

}

export const PageSchema = SchemaFactory.createForClass(Page);