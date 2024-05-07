// quick-note.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuickNoteDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    userId: string;

    description?: string; // Optional field
}
