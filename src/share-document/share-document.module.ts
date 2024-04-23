import { Module } from '@nestjs/common';
import { ShareDocumentController } from './share-document.controller';
import { ShareDocumentService } from './share-document.service';
import { ShareDocumentSchema } from './schema/shareDocument.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/auth/schema/user.schema';
import { DocumentSchema } from 'src/document/schema/document.schema';

@Module({
  imports :[
    MongooseModule.forFeature([{ name: 'Document', schema: DocumentSchema },{ name: 'ShareDocument', schema: ShareDocumentSchema }, { name: 'User', schema: UserSchema }]),
  ],
  controllers: [ShareDocumentController],
  providers: [ShareDocumentService]
})
export class ShareDocumentModule {}
