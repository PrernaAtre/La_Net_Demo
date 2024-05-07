import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import  { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/auth/schema/user.schema';

@Schema({
  timestamps: true
})

export class Page {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ default: 'Untitled Page' })
  name: string;

  @Prop({
    type: String
  })
  document: string;

  @Prop({ type: String, default: '' })
  coverImage: string;

  @Prop({ type: Boolean, default: false })
  isTrashed: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({type:Array,default:[]})
  sharedUsers:[{ type: mongoose.Schema.Types.ObjectId,
    ref: 'User'}]
}

export const PageSchema = SchemaFactory.createForClass(Page);