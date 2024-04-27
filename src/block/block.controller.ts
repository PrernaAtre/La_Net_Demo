// BlockController.ts
import { Body, Controller, Param, Post } from '@nestjs/common';
import { BlockService } from './block.service';
import { Block } from './schema/block.schema';

@Controller('block')
export class BlockController {
    constructor(private blockService: BlockService) { }

    // @Post('addBlock/:userId')
    // async addBlock(@Body() blocks: Block[], @Param('userId') userId: string) {
    //     try {
    //         console.log("Blocks received:", blocks);
    //         console.log("User ID:", userId);

    //         const newBlock = await this.blockService.addBlock(blocks, userId);
    //         console.log("New Block:", newBlock);

    //         return newBlock;
    //     } catch (error) {
    //         console.error("Error adding blocks:", error);
    //         throw error; // Rethrow the error to be handled by NestJS error handling
    //     }
    // }
    @Post('addBlock/:userId')
    async addBlock(@Body() blocks: Array<{ id: string, type: string, content: string, children: Array<{ id: string, type: string, content: string }> }>, @Param('userId') userId: string) {
        try {
            console.log("Blocks received:", blocks);
            console.log("User ID:", userId);

            const newBlock = await this.blockService.addBlock(blocks, userId);
            console.log("New Block:", newBlock);

            return newBlock;
        } catch (error) {
            console.error("Error adding blocks:", error);
            throw error; // Rethrow the error to be handled by NestJS error handling
        }
    }
}
