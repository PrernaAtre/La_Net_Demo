// // schema/block.schema.ts

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Types } from 'mongoose';
// import { User } from 'src/auth/schema/user.schema';

// @Schema({
//     timestamps: true
// })

// export class Block {
//     @Prop({ type: Types.ObjectId, ref: 'User' })
//     userId: User;

//     @Prop()
//     type: string;

//     //    @Prop({ type: [{ children: [], content: String, id: String, type: String }] }) // Define data as an array of objects with specific structure
//     //    data: Array<{ children: any[]; content: string; id: string; type: string }>;
//     @Prop({ type: Array<{content: String, id: String, type: String }> }) // Define data as an array of objects with specific structure
//     data: Array<{ content: string; id: string; type: string }>;
// }


// export const BlockSchema = SchemaFactory.createForClass(Block);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';

@Schema({
    timestamps: true
})
export class Block {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: User;

    @Prop()
    type: string;

    @Prop({ type: Array<{
        id: {
            type: String,
        },
        type: {
            type: String,
        },
        content: {
            type: String,
        },
        children: {
            type: Array<{
                id: {
                    type: String,
                },
                type: {
                    type: String,
                },
                content: {
                    type: String,
                },
            }>,
        },
    }> })
    data: Array<{
        id: string;
        type: string;
        content: string;
        children: Array<{
            id: string;
            type: string;
            content: string;
        }>;
    }>;
}

export const BlockSchema = SchemaFactory.createForClass(Block);