import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { Model } from "mongoose";
import * as nodemailer from 'nodemailer';
import { UserLoginDto } from "src/auth/dto/loginDto.dto";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { BcryptService } from "src/common/bcrypt.service";
import { CommonService } from "src/common/common.service";
import { UserSignupDto } from "../auth/dto/signupDto.dto";
import { User } from "../models/user.schema";
import { ResetPasswordDto } from "./dto/resetpassword.dto";
import { ServerError } from "src/common/utils/serverError";
import { ForgotPasswordDto } from "./dto/forgotPassword.dto";
import { ConfigService } from '@nestjs/config';
import { ResetPassworddto } from "./dto/resertPassword.dto";
// import { QuickNote } from "src/models/quickNote.schema";
import { QuickNoteService } from "src/quick-note/quick-note.service";
import { CreateQuickNoteDto } from "src/quick-note/dto/quickNote.dto";
import { QuickNote } from "src/quick-note/quickNote.schema";


@Injectable()
export class AuthService {
  private transporter;
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(QuickNote.name) private readonly quickNoteModel: Model<QuickNote>,
    private jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
    private readonly bcryptService: BcryptService,
  ) {
    const emailConfig = {
      port: Number(process.env.EMAIL_PORT),
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    };
    if (emailConfig.auth.user && emailConfig.auth.pass) {
      this.transporter = nodemailer.createTransport(emailConfig);
    } else {
      console.error('Email Config is Incomplete');
    } host: process.env.EMAIL_HOST
  }

  verifyToken(token: string): string | object {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as jwt.JwtPayload;

      if (!decoded || !decoded.id) {
        throw new ServerError({ code: 400, message: 'Invalid token' })
      }

      return decoded;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }

  async verifyUser(userId: string, token: string) {
    try {
      console.log("service---------", userId, token);
      const checkResetToken = jwt.verify(
        token,
        process.env.JWT_SECRET,
      );
      const id = checkResetToken['id'];
      const user = await this.userModel.findOne({ _id: id });
      if (!user) {
        return { msg: "Invalid User", status: HttpStatus.NOT_FOUND };
      }
      return { msg: "User verified successfully", status: HttpStatus.OK };
    } catch (err) {
      console.error(err);
      return { msg: 'Internal server error', status: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }

  async createUser(
    imagePath: string,
    userSignupDto: UserSignupDto
  ) {
    try {
      const { username, email, password } = userSignupDto;
      const checkEmail = await this.userModel.findOne({ email }).lean();
      if (checkEmail) {
        throw new ServerError({
          message: "Account with same email already exists. Please sign in.",
          code: 409,
        });
      }

      const hashedPassword = await this.bcryptService.hash(password);

      const image_url =
        await this.cloudinaryService.uploadProfileImage(imagePath);

      const newUser = await this.userModel.create({
        username,
        email,
        password: hashedPassword,
        profile_image: image_url?.url,
      });

      const createdQuickNote = await this.quickNoteModel.create({ data: "", userId: newUser._id });

      return { message: "User register succesfully" };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        "Something went wrong while trying to sign up."
      );
    }
  }

  async loginUser(
    userLoginDto: UserLoginDto
  ): Promise<{ token: string; user: Omit<User, 'password'> }> {
    try {
      const { email, password } = userLoginDto;
      const user = await this.userModel.findOne({ email: email }, { _id: 1, username: 1, email: 1, profile_image: 1, password: 1, IsSubscribed: 1 }).lean();
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = this.jwtService.sign({ id: user._id });
        const { password, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
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
      return { message: "User password updated successfully." };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        "Something went wrong while trying to reset password."
      );
    }
  }
}
