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
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one user ID must be provided' })
    @IsString({ each: true, message: 'Each user ID must be a string' })
    userIds: string[];
  }

export class RemoveSharedUsersDto {
    @IsString()
    @IsNotEmpty()
    userId: string;
  }
  