import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePageDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    document: string

    @IsOptional()
    coverImage: string;
}
export class UpdatePageDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsOptional()
    @IsString()
    document: string

    @IsOptional()
    @IsString()
    coverImage: string;
}