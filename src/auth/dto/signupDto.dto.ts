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
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  profile_image?: string;
}
