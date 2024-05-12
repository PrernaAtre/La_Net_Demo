// quick-note.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuickNoteDto {
    @IsNotEmpty()
    data?: string;
}

export class UpdateQuickNoteDto 
{
    @IsNotEmpty()
    data?: string;
}