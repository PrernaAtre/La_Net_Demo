import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class GetUserByEmailDto{
    @IsString()
    @IsNotEmpty()
    slug: string;
}

export class SearchUserDto {
    @IsString()
    @IsOptional()
    name: string;
    @IsNumber()
    @IsOptional()
    limit: number;
  }
  