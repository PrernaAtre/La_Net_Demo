import { Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockSchema } from './schema/block.schema';
import { UserSchema } from 'src/auth/schema/user.schema';

@Module({
  imports :[
    MongooseModule.forFeature([{ name: 'Block', schema: BlockSchema },{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [BlockController],
  providers: [BlockService]
})
export class BlockModule {}
