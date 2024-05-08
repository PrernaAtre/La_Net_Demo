// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
// import { Types } from 'mongoose';

// @Schema({
//     timestamps: true
// })

// export class Payment
// {
//     @Prop({required:true})
//     userId : string;

//     @Prop({required: true})
//     amount : number;

//     @Prop({required : true})
//     subscription : 
// }


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose';

@Schema({
    timestamps: true
})

export class Payment {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    stripeSubscriptionId: string;

    @Prop({ required: true })
    stripeCustomerId: string;

    @Prop({ required: true })
    stripePriceId: string;

    @Prop({ required: true })
    stripeCurrentPeriodEnd: Date;
}
export const PaymentSchema = SchemaFactory.createForClass(Payment);