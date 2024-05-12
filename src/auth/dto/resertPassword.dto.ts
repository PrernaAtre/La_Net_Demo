import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPassworddto {
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    currentPassword: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(6) 
    confirmPassword: string;
}

export class UpdatePasswordDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    current_password: string;

    @IsString()
    @IsNotEmpty()
    confirm_password: string;
}