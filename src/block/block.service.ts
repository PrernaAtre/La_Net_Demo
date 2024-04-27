// BlockService.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Block } from './schema/block.schema';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';

@Injectable()
export class BlockService {
    constructor(
        @InjectModel(Block.name)
        private blockModel: Model<Block>,
        @InjectModel('User') private userModel: Model<User>
    ) {}

    // async addBlock(blocks: Block[], userId: string) {
    //     try {
    //         console.log("18", blocks)
    //         const user = await this.userModel.findOne({ _id: userId });
    //         if (!user) {
    //             console.log("User not found");
    //             return null; // Or throw an error, depending on your application logic
    //         }
    //        const newBlock = new this.blockModel({userId,data:blocks})
    //        console.log("33", newBlock)
    //         await newBlock.save();
    //         return newBlock;
    //     } catch (error) {
    //         console.error("Error adding blocks:", error);
    //         throw error; // Rethrow the error to be handled by NestJS error handling
    //     }
    // }
    async addBlock(blocks: Array<{ id: string, type: string, content: string, children: Array<{ id: string, type: string, content: string }> }>, userId: string) {
        try {
            const user = await this.userModel.findOne({ _id: userId });
            if (!user) {
                console.log("User not found");
                return null; // Or throw an error, depending on your application logic
            }
    
            const newBlock = new this.blockModel({ userId, data: blocks });
            await newBlock.save();
            return newBlock;
        } catch (error) {
            console.error("Error adding blocks:", error);
            throw error; // Rethrow the error to be handled by NestJS error handling
        }
    }
}
