import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({
    timestamps: true
})
export class User {
    @Prop({ required: true, unique: true })
    username: string

    @Prop({ required: true, unique: true, lowercase: true })
    email: string

    @Prop({ required: true, minlength: 9 })
    password: string

    @Prop({ default: false })
    confirm_password : string

    @Prop()
    profile_image : string
}

export const UserSchema = SchemaFactory.createForClass(User);