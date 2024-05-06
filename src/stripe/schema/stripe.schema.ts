import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose';

@Schema({
    timestamps: true
})

<<<<<<<<< Temporary merge branch 1
=========
// export class Payment
// {
//     @Prop({required:true})
//     userId : string;

//     @Prop({required: true})
//     amount : number;

//     @Prop({required : true})
//     subscription : 
// }

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

