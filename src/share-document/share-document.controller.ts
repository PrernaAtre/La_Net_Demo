import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ShareDocumentService } from './share-document.service';
import { CreateShareDocumentDto } from './dto/createShareDocument.dto';
import { DocumentService } from 'src/document/document.service';
import Stripe from 'stripe';

@Controller('share-document')
export class ShareDocumentController {

    constructor(private shareDocumentService: ShareDocumentService,
        //  private readonly documentService : DocumentService,
    ) { }

    @Post('/share/:senderUserId')
    async createShareDocument(
        @Param('senderUserId') senderUserId: string,
        @Body() createShareDocumentDto: CreateShareDocumentDto
    ) {
        try {
            return this.shareDocumentService.createShareDocument(
                senderUserId,
                createShareDocumentDto.receiverUserId,
                createShareDocumentDto.shareDocumentId
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    
}
