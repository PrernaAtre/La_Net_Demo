import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    username?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    profile_image?: string;
}
