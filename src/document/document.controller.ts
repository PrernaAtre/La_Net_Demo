import { Body, Controller, HttpException, HttpStatus, Param, Post, Get, UploadedFile, UploadedFiles, UseInterceptors, Delete, Put, Query, InternalServerErrorException } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CreateDocumentDto } from './dto/CreateDocument.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const uniqueFilename = Date.now() + extname(file.originalname);
        cb(null, uniqueFilename);
    },
});

@Controller('document')
export class DocumentController {
    constructor(private documentService: DocumentService, private readonly cloudinaryService: CloudinaryService) { }

    @Post('/createDocument')
    @UseInterceptors(FileInterceptor('coverImageUrl', { storage }))
    async createNote(@Body() createDocumentDto: CreateDocumentDto, @UploadedFile() coverImageUrl: Express.Multer.File): Promise<string> {
        console.log("createDocumentDto:", createDocumentDto);
        console.log("file :", coverImageUrl);

        try {
            if (!coverImageUrl) {
                throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
            }
            return this.documentService.createDocument(coverImageUrl.path, createDocumentDto);
        }
        catch (error) {
            console.log("error in uploading image : ", error);
            throw new HttpException('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/fetchDocuments/:userId')
    async fetchNotes(@Param('userId') userId: string): Promise<any> {
        try {
            // Call the service method to fetch notes for the provided userId
            const notes = await this.documentService.fetchNotesByUserId(userId);
            return notes; // Assuming the service returns the notes
        } catch (error) {
            console.log("Error fetching notes:", error);
            throw new HttpException('Failed to fetch notes', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/fetchDocument/:documentId')
    async fetchDocumentById(@Param('documentId') documentId: string): Promise<any> {
        try {
            const document = await this.documentService.fetchDocumentById(documentId);
            return document;
        } catch (error) {
            console.log("Error fetching document:", error);
            throw new HttpException('Failed to fetch document', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete('/deleteDocument/:documentId')
    async deleteDocument(@Param('documentId') documentId: string): Promise<any> {
        try {
            console.log("document id : ", documentId);
            // Call the service method to delete the document
            await this.documentService.deleteDocument(documentId);
            return { message: 'Document deleted successfully' };
        } catch (error) {
            console.log("Error deleting document:", error);
            throw new HttpException('Failed to delete document', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/fetchDeletedDocuments/:userId')
    async fetchDeletedDocuments(@Param('userId') userId: string): Promise<Document[]> {
        try {
            // Call the service method to fetch deleted documents by user ID
            const deletedDocuments = await this.documentService.getDeletedDocumentsByUserId(userId);
            return deletedDocuments;
        } catch (error) {
            console.log("Error fetching deleted documents:", error);
            throw new HttpException('Failed to fetch deleted documents', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put('/restoreDocument/:documentId')
    async restoreDocument(@Param('documentId') documentId: string): Promise<any> {
        try {
            const restoredDocument = await this.documentService.restoreDocument(documentId);
            return { message: 'Document restored successfully', document: restoredDocument };
        } catch (error) {
            console.log("Error restoring document:", error);
            throw new HttpException('Failed to restore document', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/searchDocuments/:userId')
    async searchDocuments(
        @Query('name') name: string,
        @Param('userId') userId: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<any> {
        try {
            const skip = (page - 1) * limit;
            const documents = await this.documentService.searchDocumentsByName(name, userId, skip, limit);
            return documents;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Failed to search documents');
        }
    }
}
