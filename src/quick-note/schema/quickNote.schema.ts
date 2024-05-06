import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Types } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';

@Schema({
    timestamps: true
})

export class QuickNote
{
    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: User;
  
    @Prop({ type: String })
    name : string;
  
    @Prop({
      type: String
    })
    document: string;
  
    @Prop({ type: Boolean, default: false })
    isTrashed: boolean;
  
    @Prop({ type: Date, default: Date.now })
    createdAt: Date;
  
    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const QuickNoteSchema = SchemaFactory.createForClass(QuickNote);