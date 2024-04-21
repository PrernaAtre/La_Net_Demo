import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDocumentDto 
{
    @IsString()
    @IsNotEmpty()
    title:  string;

    @IsString()
    @IsOptional()
    iconImage:  string;

    @IsString()
    @IsOptional()
    coverImageUrl?:  string;

    @IsString()
    userId :  string;

    @IsString()
    @IsOptional()
    description :  string;

    @IsBoolean()
    isAvailable: boolean;
}