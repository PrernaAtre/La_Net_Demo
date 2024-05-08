import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { Model } from "mongoose";
import { UserLoginDto } from "src/auth/dto/loginDto.dto";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { BcryptService } from "src/common/bcrypt.service";
import { CommonService } from "src/common/common.service";
import { UserSignupDto } from "../auth/dto/signupDto.dto";
import { User } from "../models/user.schema";
import { ResetPasswordDto } from "./dto/resetpassword.dto";
import { ServerError } from "src/common/utils/serverError";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly commonService: CommonService,
    private readonly bcryptService: BcryptService
  ) {}

  verifyToken(token: string): string | object {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as jwt.JwtPayload;

      if (!decoded || !decoded.id) {
        throw new Error("Invalid token");
      }

      return decoded;
    } catch (error) {
      // Handle invalid token or other errors
      throw new UnauthorizedException("Invalid token");
    }
  }

  async createUser(
    imagePath: string,
    userSignupDto: UserSignupDto
  ) {
    try {
      const { username, email, password, profile_image } = userSignupDto;
      const checkEmail = await this.userModel.findOne({ email });
      if (checkEmail) {
        throw new ServerError({
            message: "Account with same email already exists. Please sign in.",
            code: 409,
          });
      }

      const hashedPassword = await this.bcryptService.hash(password);

      const image_url =
        await this.cloudinaryService.uploadProfileImage(imagePath);

      await this.userModel.create({
        username,
        email,
        password: hashedPassword,
        profile_image: image_url?.url,
      });

      return {message:"User register succesfully"};
    } catch (error) {
        if (error instanceof HttpException) throw error;

        throw new InternalServerErrorException(
          "Something went wrong while trying to log in user."
        );
      }
  }

  async loginUser(
    userLoginDto: UserLoginDto
  ): Promise<{ token: string; user: UserLoginDto }> {
    try {
      const { email, password } = userLoginDto;
      const user = await this.userModel.findOne({ email: email });
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = this.jwtService.sign({ id: user._id });
        return { token, user };
      }
      throw new ServerError({
        message: "Invalid email or password.",
        code: 400,
      });

    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        "Something went wrong while trying to log in user."
      );
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    currentUser
  ) {
    try {
      const user = await this.userModel.findOne({ _id: currentUser.id });

      if (!user) throw new ServerError({
        message: "User not found.",
        code: 404,
      });    

      const isMatch = await this.bcryptService.compare(
        resetPasswordDto.oldPassword,
        user.password
      );
      if (!isMatch) {
        throw new ServerError({
            message: "Old password is incorrect.",
            code: 400,
          });    
      }

      const hashedPassword = await this.bcryptService.hash(
        resetPasswordDto.newPassword
      );
      user.password = hashedPassword;
      await user.save();
      return {message:"User password updated successfully."};
    } catch (error) {
        if (error instanceof HttpException) throw error;

        throw new InternalServerErrorException(
          "Something went wrong while trying to log in user."
        );
      }
  }
}
