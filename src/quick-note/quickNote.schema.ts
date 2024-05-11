import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose';

@Schema({
    timestamps: true
})

export class QuickNote
{

    @Prop({required:true})
    userId : string;

    @Prop()
    data : string
}

export const QuickNoteSchema = SchemaFactory.createForClass(QuickNote);