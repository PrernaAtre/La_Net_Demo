import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ShareDocument } from './schema/shareDocument.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';


@Injectable()
export class ShareDocumentService {

    constructor(
        @InjectModel(ShareDocument.name)
        private readonly shareDocumentModel: Model<ShareDocument>,
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('Document') private documentModel: Model<Document>,
    ) {}

    async createShareDocument(
        senderUserId: string,
        receiverUserId: string,
        shareDocumentId: string
    ): Promise<ShareDocument> {
        try{
            console.log(senderUserId,receiverUserId , shareDocumentId)
            const senderUser = await this.userModel.findById(senderUserId).exec();
            const receiverUser = await this.userModel.findById(receiverUserId).exec();
            const document = await this.documentModel.findOne({_id : shareDocumentId}).exec();
            console.log(senderUser, receiverUser, document);
            
            if (!senderUser || !receiverUser) {
                console.log("tttttttttttttttttt");
                throw new NotFoundException('User not found.');
            }
            if(!document)
                {
                    throw new NotFoundException('document not found.');
                }
            const createdShareDocument = new this.shareDocumentModel({
                senderUserId,
                receiverUserId,
                shareDocumentId
            });
            return createdShareDocument.save();
        }
        catch(err)
        {
           return err.message;
        }    
    }
}
