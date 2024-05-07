import { IsNotEmpty, IsString } from "class-validator";

export class GetUserByEmailDto{
    @IsString()
    @IsNotEmpty()
    slug: string;
}

export class SearchUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  }
  