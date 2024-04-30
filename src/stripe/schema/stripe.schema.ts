import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose';

@Schema({
    timestamps: true
})

export class Payment
{
        @Prop({required: true})
        userId: string;
    
        @Prop({required: true})
        username: string;
    
        @Prop({required: true})
        email: string;
    
        @Prop({required: true})
        amount: string; 
}
export const PaymentSchema = SchemaFactory.createForClass(Payment);