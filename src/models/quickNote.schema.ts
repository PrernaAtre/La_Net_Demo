import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose';

@Schema({
    timestamps: true
})

export class QuickNote
{
    @Prop({type: Types.ObjectId})
    userId :Types.ObjectId;

    @Prop()
    data : string
}

export const QuickNoteSchema = SchemaFactory.createForClass(QuickNote);