import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { CreateDocumentDto } from './dto/CreateDocument.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { TrashDocument } from './schema/trashDocument.schema';

@Injectable()
export class DocumentService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('Document') private documentModel: Model<Document>,
        @InjectModel('TrashDocument') private trashDocumentModel: Model<TrashDocument>,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async createDocument(coverImage : string , createDocumentDto: CreateDocumentDto) : Promise<string>
    {
        console.log("coverImage : ", coverImage)
        console.log("createDocumentDto : ", createDocumentDto);

        try {
            const { title, iconImage , coverImageUrl, userId, description } = createDocumentDto;
            const image_url = await this.cloudinaryService.uploadCoverImage(coverImage)

            const document = await this.documentModel.create({
                title, iconImage , coverImageUrl : image_url.url, userId , description, isAvailable : true
            });
            return "document create succesfully";
        }
        catch (error) {
            console.log(error)
            if (error.code == '11000') {
                throw new ConflictException('Duplicate data input')
            }
            else {
                throw new InternalServerErrorException();
            }
        }
    }

    async fetchNotesByUserId(userId: string): Promise<Document[]> {
        try {
            const notes = await this.documentModel.find({ userId, isAvailable : true }).exec();
            console.log(notes);
            return notes;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Failed to fetch notes');
        }
    }

    async fetchDocumentById(documentId: string): Promise<Document> {
        try {
            const document = await this.documentModel.findById(documentId).exec();
            return document;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Failed to fetch document');
        }
    }

    async deleteDocument(documentId: string): Promise<void> {
        try {
            // Check if the document belongs to the user
           // console.log(isAvailable);
            const document = await this.documentModel.findOneAndUpdate({ _id: documentId },{isAvailable : false},{new:true}).exec();
            console.log("document : ",document);
            if (!document) {
                throw new NotFoundException('Document not found or does not belong to the user');
            }
            // if (!document.isDeleted) {
            //     document.isDeleted = true;
            //     await document.save();
            // }
            // Delete the document
            // await this.documentModel.findByIdAndDelete(documentId).exec();
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Failed to delete document');
        }
    }

    async getDeletedDocumentsByUserId(userId: string): Promise<Document[]> {
        try {
            // Retrieve deleted documents based on user ID where isAvailable is false
            const deletedDocuments = await this.documentModel.find({ userId, isAvailable: false }).exec();
            return deletedDocuments;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Failed to fetch deleted documents');
        }
    }

    async restoreDocument(documentId: string): Promise<Document> {
        try {
            // Find the document in the trash
            const deletedDocument = await this.documentModel.find({_id : documentId}).exec();

            if (!deletedDocument) {
                throw new NotFoundException('Deleted document not found');
            }

            // Restore the document by updating isAvailable field
            const restoredDocument = await this.documentModel.findByIdAndUpdate(documentId, { isAvailable: true }, { new: true }).exec();

            if (!restoredDocument) {
                throw new NotFoundException('Restored document not found');
            }

            return restoredDocument;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Failed to restore document');
        }
    }
}
