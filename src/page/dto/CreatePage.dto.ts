import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePageDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsNotEmpty()
    document: Array<any>

    @IsNotEmpty()
    coverImage: string;
}
export class UpdatePageDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsOptional()
    @IsArray()
    document: Array<any>

    @IsOptional()
    @IsString()
    coverImage: string;
}