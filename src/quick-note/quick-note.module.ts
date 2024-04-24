import { Module } from '@nestjs/common';
import { QuickNoteController } from './quick-note.controller';
import { QuickNoteService } from './quick-note.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuickNoteSchema } from './schema/quickNote.schema';

@Module({
  imports : [
    MongooseModule.forFeature([{ name: 'QuickNote', schema: QuickNoteSchema }]),
  ],
  controllers: [QuickNoteController],
  providers: [QuickNoteService]
})
export class QuickNoteModule {}
