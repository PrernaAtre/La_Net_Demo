import { Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Model } from 'mongoose';
import { AuthenticatedRequest } from "src/auth/auth.controller";
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProfileDto } from "../auth/dto/updateProfileDto.dto";
import { User } from '../models/user.schema';
import { UserService } from './user.service';
import { GetUserByEmailDto, SearchUserDto } from './dto/user.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';


const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueFilename = Date.now() + extname(file.originalname);
    cb(null, uniqueFilename);
  },
});

@Controller("user")
export class UserController {
  constructor(
    private userService: UserService,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) { }

  @Put()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("profile_image", { storage }))
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() profile_image: Express.Multer.File,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<Object> {
    try {
      if (!profile_image) {
        throw new HttpException("No file uploaded", HttpStatus.BAD_REQUEST);
      }

      console.log("updateProfileDto: ", updateProfileDto);

      console.log("profile_image: ", profile_image);

      return this.userService.updateProfile(
        profile_image.path,
        updateProfileDto,
        currentUser
      );
    } catch (error) {
      console.error("Error in updating profile: ", error);
      throw new HttpException(
        "Failed to update profile",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("/search")
  @UseGuards(AuthGuard)
  async searchUser(
    @Query() searchUserDto: SearchUserDto,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<User[]> {
    try {
      const name = searchUserDto.name??"";
      const limit = Number(searchUserDto.limit)??10;
      const users = await this.userService.searchUserByName(name,limit, currentUser);
      return users;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException("No users found with the provided name.");
      }
      throw error;
    }
  }

  @Get("/fetchUsers")
  @UseGuards(AuthGuard)
  async fetchUsers(@Req() { currentUser }: AuthenticatedRequest): Promise<User[]> {
    try {
      return await this.userService.fetchUsers(currentUser);
    } catch (error) {
      throw new HttpException(
        "Failed to fetch users",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("/getUserByEmail")
  @UseGuards(AuthGuard)
  async getUserByEmail(
    @Query() getUserByEmailDto: GetUserByEmailDto,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<User[]> {
    try {
      const { slug } = getUserByEmailDto
      console.log('slug', slug)
      return await this.userService.getUserByEmail(slug, currentUser);
    } catch (error) {
      throw new HttpException(
        "Failed to fetch users",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
