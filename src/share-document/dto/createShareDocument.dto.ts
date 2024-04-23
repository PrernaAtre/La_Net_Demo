import { IsString } from "class-validator";

export class CreateShareDocumentDto 
{
    @IsString()
    senderUserId: string;

    @IsString()
    receiverUserId: string;

    @IsString()
    shareDocumentId: string;
}