import { Module, forwardRef } from '@nestjs/common';
import { QuickNoteController } from './quick-note.controller';
import { QuickNoteService } from './quick-note.service';
import { MongooseModule } from '@nestjs/mongoose';
// import { QuickNoteSchema } from './quickNote.schema';
import { AuthModule } from 'src/auth/auth.module';
import { QuickNoteSchema } from './quickNote.schema';

@Module({
  imports : [
    MongooseModule.forFeature([{ name: 'QuickNote', schema: QuickNoteSchema }]),

    forwardRef(()=>AuthModule)
  ],
  controllers: [QuickNoteController],
  providers: [QuickNoteService],
  exports : [QuickNoteService]
})
export class QuickNoteModule {}
