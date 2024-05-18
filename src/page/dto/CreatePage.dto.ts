import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePageDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    document: string

    @IsOptional()
    coverImage: string;
}
export class UpdatePageDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsOptional()
    @IsString()
    document: string

    @IsOptional()
    @IsString()
    coverImage: string;
}

export class AddSharedUsersDto {
  @IsString()
  userId: string;

  @IsString()
  url: string;
}

export class RemoveSharedUsersDto {
    @IsString()
    @IsNotEmpty()
    userId: string;
  }
  