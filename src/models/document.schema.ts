import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose';

@Schema({
    timestamps: true
})

export class Document
{
    @Prop({required:true})
    title:  string;

    @Prop()
    iconImage : string;

    @Prop()
    coverImageUrl: string

    @Prop({required:true})
    userId : string;

    // @Prop({type : [{ type : mongoose.Schema.Types.ObjectId, ref: 'Document'}] })
    // childDocuments : string[]

    @Prop()
    description : string

    @Prop({required : true, default:false})
    isAvailable: boolean;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);