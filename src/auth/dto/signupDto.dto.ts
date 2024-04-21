// signup.dto.ts
import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class UserSignupDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6) // Example validation for minimum length
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6) // Example validation for minimum length
  confirm_password: string;

  @IsString()
  @IsOptional()
  profile_image?: string;
}
