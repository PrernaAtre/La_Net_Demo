import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    username?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(9)
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    confirm_password?: string;

    @IsString()
    @IsOptional()
    profile_image?: string;
}
