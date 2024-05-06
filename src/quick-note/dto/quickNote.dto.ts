// quick-note.dto.ts

import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQuickNoteDto {
    @IsString()
    @IsOptional()
    _id: string;

    @IsString()
    @IsOptional()
    name : string;

    @IsString()
    userId: string;

    @IsArray()
    document: Array<any>
}
