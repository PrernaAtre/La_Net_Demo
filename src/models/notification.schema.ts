import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
    timestamps: true
})

export class Notification
{
    @Prop({type: Types.ObjectId})
    sender :Types.ObjectId;

    @Prop({type: Types.ObjectId})
    receiver : Types.ObjectId;

    @Prop()
    senderName : string;

    @Prop()
    message : string;

    @Prop({default :  false})
    isRead : boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);