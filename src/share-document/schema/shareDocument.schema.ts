import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { Document } from 'src/document/schema/document.schema';

@Schema({
    timestamps: true
})
export class ShareDocument {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    senderUserId : User;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    receiverUserId : User;

    @Prop({ type: Types.ObjectId, ref: 'Document' })
    shareDocumentId : Document;
}

export const ShareDocumentSchema = SchemaFactory.createForClass(ShareDocument);