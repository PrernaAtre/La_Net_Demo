import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema } from './schema/document.schema';
import { UserSchema } from 'src/auth/schema/user.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { TrashDocumentSchema } from './schema/trashDocument.schema';

@Module({
  imports : [
    MongooseModule.forFeature([{ name: 'Document', schema: DocumentSchema }, { name: 'User', schema: UserSchema }, { name: 'TrashDocument', schema: TrashDocumentSchema }]),
  ],
  controllers: [DocumentController],
  providers: [DocumentService, CloudinaryService],
  exports : [DocumentService]
})
export class DocumentModule {}
