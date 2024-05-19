import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { UpdateProfileDto } from "src/auth/dto/updateProfileDto.dto";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { BcryptService } from "src/common/bcrypt.service";
import { CurrentUser } from "src/common/utils/common.types";
import { ServerError } from "src/common/utils/serverError";
import { User } from "src/models/user.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  async updateProfile(
    imagePath: string,
    updateProfileDto: UpdateProfileDto,
    currentUser: CurrentUser
  ): Promise<Object> {
    try {
      const { username, profile_image } = updateProfileDto;

      const user = await this.userModel.findById(currentUser.id);
      if (!user) {
        throw new ServerError({ message: "User not found", code: 400 });
      }
      const image_url =
        await this.cloudinaryService.uploadProfileImage(imagePath);
      user.profile_image = image_url?.url || profile_image;

      const updated_user = await this.userModel.findByIdAndUpdate(
        currentUser.id,
        {
          username,
          profile_image: image_url?.url,
        },
        { new: true, projection: { _id: 1, profile_image: 1, username: 1 } }
      );

      return updated_user;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        "Something went wrong while trying to update profile."
      );
    }
  }

  async searchUserByName(
    name: string,
    limit: number,
    currentUser: CurrentUser
  ): Promise<User[]> {
    try {
      const users = await this.userModel
        .find(
          {
            $or: [
              { username: { $regex: new RegExp(`^${name}`) } },
              { email: { $regex: new RegExp(`^${name}`) } },
            ],
            _id: { $ne: currentUser.id },
          },
          { username: 1, email: 1 }
        )
        .limit(Number(limit));
      return users;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        "Something went wrong while trying to search username."
      );
    }
  }

  async fetchUsers(currentUser: CurrentUser): Promise<User[]> {
    try {
      const users = await this.userModel.find(
        { _id: { $ne: currentUser.id } },
        { username: 1, email: 1 }
      );
      return users;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        "Something went wrong while trying to fetch users."
      );
    }
  }

  async _findUserById(userId: string, currentUser: CurrentUser): Promise<User> {
    try {
      const user = await this.userModel.findById(userId, {
        _id: 1,
        username: 1,
        email: 1,
      });
      if (!user)
        throw new ServerError({ message: "User not found", code: 400 });

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        "Something went wrong while trying to find user."
      );
    }
  }

  async getUserByEmail(slug: string, currentUser: CurrentUser): Promise<User[]> {
    try {
      const users = await this.userModel.find(
        {
          email: { $regex: new RegExp(`^${slug}`) },
          _id: { $ne: (currentUser.id) },
        },
        { userId: "$_id", _id: 0, email: 1 }
      );
      return users;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        "Something went wrong while trying to fetch user by email."
      );
    }
  }
  async getUserDetails(currentUser: CurrentUser): Promise<User> {
    try {
      const user = await this.userModel
        .findOne(
          { _id: mongoose.Types.ObjectId.createFromHexString(currentUser.id) },
          { _id: 1, username: 1, email: 1, profile_image: 1, isSubscribed: 1 }
        )
        .lean();

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        "Something went wrong while trying to get user detail."
      );
    }
  }

  async getAllUsers(page: number, limit: number): Promise<{ users: User[], total: number, page: number, limit: number }> {
    try {
      const users = await this.userModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit);
      console.log("users=====",users);
      const total = await this.userModel.countDocuments();

      return { users, total, page, limit };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong while trying to get user detail.'
      );
    }
  }
}
