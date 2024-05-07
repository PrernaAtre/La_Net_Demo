import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose';

@Schema({
    timestamps: true
})

export class QuickNote
{
    @Prop({required:true})
    title:  string;

    @Prop({required:true})
    userId : string;

    @Prop()
    description : string
}

export const QuickNoteSchema = SchemaFactory.createForClass(QuickNote);