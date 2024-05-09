import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema({
    timestamps: true
})
export class User {

    @Prop({ required: true })
    username: string

    @Prop({ required: true, unique: true, lowercase: true })
    email: string

    @Prop({ required: true })
    password: string

    @Prop()
    profile_image: string

    @Prop()
    customerId: string

    @Prop({ default: false })
    IsSubscribed: boolean

}

export const UserSchema = SchemaFactory.createForClass(User);