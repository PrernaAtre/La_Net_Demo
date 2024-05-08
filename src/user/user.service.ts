import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateProfileDto } from 'src/auth/dto/updateProfileDto.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { BcryptService } from 'src/common/bcrypt.service';
import { User } from 'src/models/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly bcryptService: BcryptService
  ) { }


  async updateProfile(imagePath: string, updateProfileDto: UpdateProfileDto, currentUser): Promise<Object> {
    try {
      const { username, profile_image } = updateProfileDto;

      const user = await this.userModel.findById(currentUser.id);
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      // const hashedPassword = await this.bcryptService.hash(password);

      const image_url = await this.cloudinaryService.uploadProfileImage(imagePath);
      user.profile_image = image_url?.url || profile_image; // Update profile image if new image is uploaded

      const updated_user = await this.userModel.findByIdAndUpdate(currentUser.id, { // Use findByIdAndUpdate to update existing user
        username,
        profile_image: image_url?.url,
      }, { new: true });

      return updated_user;
    } catch (error) {
      console.error('Error in updating profile: ', error);
      throw new InternalServerErrorException('Failed to update profile');
    }
  }

  async searchUserByName(name: string,limit: number, currentUser: { id: any; }): Promise<User[]> {
    const users = await this.userModel.find({ $or:[{username: { $regex: new RegExp(`^${name}`) }},{email: { $regex: new RegExp(`^${name}`)}}]
      , _id: { $ne: currentUser.id }
     }, { username: 1,email:1 }).limit(Number(limit));
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found with the provided name.');
    }
    return users;
  }

  async fetchUsers(currentUser): Promise<User[]> {
    try {
      const users = await this.userModel.find({ _id: { $ne: currentUser.id } }, { username: 1, email: 1 });
      if (!users || users.length === 0) {
        throw new NotFoundException('No users found.');
      }
      return users;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users.');
    }
  }

  async _findUserById(userId: string, currentUser): Promise<User> {
    try {
      const user = await this.userModel.findById(userId, { _id: 1, username: 1, email: 1 });
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find user.');
    }
  }

  async getUserByEmail(slug: string, currentUser): Promise<User[]> {

    try {
      const users = await this.userModel.find({ email: { $regex: new RegExp(`^${slug}`) }, _id: { $ne: currentUser.id } }, { userId: "$_id", _id: 0, email: 1 });
      return users
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users.');
    }
  }

}
