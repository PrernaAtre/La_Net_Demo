import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FileInterceptor } from "@nestjs/platform-express";
import { Model } from "mongoose";
import { AuthenticatedRequest } from "src/auth/auth.controller";
import { AuthGuard } from "src/auth/jwt-auth.guard";
import { UpdateProfileDto } from "../auth/dto/updateProfileDto.dto";
import { User } from "../models/user.schema";
import { UserService } from "./user.service";
import { GetUserByEmailDto, SearchUserDto } from "./dto/user.dto";
import { diskStorage } from "multer";
import { extname } from "path";
import { ServerError } from "src/common/utils/serverError";

const storage = diskStorage({
  destination: "./uploads",
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
    private userModel: Model<User>
  ) { }

  @Put()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("profile_image", { storage }))
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() profile_image: Express.Multer.File,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<Object> {
    if (!profile_image) {
      throw new ServerError({ message: "No file uploaded", code: 400 });
    }

    return this.userService.updateProfile(
      profile_image.path,
      updateProfileDto,
      currentUser
    );
  }

  @Get("/search")
  @UseGuards(AuthGuard)
  async searchUser(
    @Query() searchUserDto: SearchUserDto,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<User[]> {
    const name = searchUserDto.name ?? "";
    const limit = Number(searchUserDto.limit) ?? 10;
    const users = await this.userService.searchUserByName(
      name,
      limit,
      currentUser
    );
    return users;
  }

  @Get("/fetchUsers")
  @UseGuards(AuthGuard)
  async fetchUsers(
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<User[]> {
    return await this.userService.fetchUsers(currentUser);
  }

  @Get("/getUserByEmail")
  @UseGuards(AuthGuard)
  async getUserByEmail(
    @Query() getUserByEmailDto: GetUserByEmailDto,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<User[]> {
    const { slug } = getUserByEmailDto;
    return await this.userService.getUserByEmail(slug, currentUser);
  }

  @Get("details")
  @UseGuards(AuthGuard)
  async getUserDetails(
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<User> {
    return await this.userService.getUserDetails(currentUser);
  }
}
