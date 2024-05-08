import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    profile_image?: string;
}
