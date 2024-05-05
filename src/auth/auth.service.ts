import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSignupDto } from "../auth/dto/signupDto.dto";
import { UserLoginDto } from 'src/auth/dto/loginDto.dto';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { Model, ObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateProfileDto } from './dto/updateProfileDto.dto';
import * as jwt from 'jsonwebtoken';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ConfigService } from '@nestjs/config';
import { ResetPassworddto, UpdatePasswordDto } from './dto/resertPassword.dto';

@Injectable()
export class AuthService {
    private transporter;
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly cloudinaryService: CloudinaryService
    ) {
        const emailConfig = {
            host: process.env.EMAIL_HOST,
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
          }
     }

    async verifyToken(token: string): Promise<boolean> {
        try {
            console.log("auth service roken ----",token)
          const decodedToken = this.jwtService.verify(token);
          // If the token is successfully verified, you can return true
          console.log(decodedToken)
          return !!decodedToken;
        } catch (error) {
          // If verification fails, you can handle the error here
          throw new UnauthorizedException('Invalid token');
        }
      }

      async verifyUser(userId : string, token : string)
      {
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

    async createUser(imagePath: string, userSignupDto: UserSignupDto): Promise<string> {
        try {
            const { username, email, password, confirm_password, profile_image } = userSignupDto;
            const checkEmail = await this.userModel.findOne({ email })
            if (checkEmail) {
                return "Email is duplicate..";
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            if (password !== confirm_password) {
                return "your password and confirm password are not same";
            }
            console.log('---------', userSignupDto)

            const image_url = await this.cloudinaryService.uploadProfileImage(imagePath)
            console.log('---121', imagePath);
            await this.userModel.create({
                username,
                email,
                password: hashedPassword,
                profile_image: image_url?.url,
            });
            return "user register succesfully";
        } catch (error) {
            console.log('error', error)
            if (error.code == '11000') {
                throw new ConflictException('Duplicate data input')
            }
            else {
                throw new InternalServerErrorException();
            }
        }
    }


    async loginUser(userLoginDto: UserLoginDto): Promise<{ token: string, user: UserLoginDto }> {
        try {
            const { email, password } = userLoginDto;
            const user = await this.userModel.findOne({ email: email });
            if (user && (await bcrypt.compare(password, user.password))) {
                const token = this.jwtService.sign({ id: user._id });
                return { token, user };
            }
            else {
                throw new UnauthorizedException("Invalid Email And Password");
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    async updateProfile(imagePath: string, userId: string, updateProfileDto: UpdateProfileDto): Promise<Object> {
        console.log(userId)
            console.log(updateProfileDto);
        try {
            const { username, email, password, confirm_password, profile_image } = updateProfileDto;

            console.log(userId);
            const user = await this.userModel.findById(userId).exec();
            if (!user) {
                throw new NotFoundException('User not found.');
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            if (password !== confirm_password) {
                return "your password and confirm password are not same";
            }
            const image_url = await this.cloudinaryService.uploadProfileImage(imagePath);
            user.profile_image = image_url?.url || profile_image; // Update profile image if new image is uploaded
           
            const updated_user = await this.userModel.findByIdAndUpdate(userId, { // Use findByIdAndUpdate to update existing user
                username,
                email,
                password: hashedPassword,
                profile_image: image_url?.url,
            },{new:true});

            return updated_user;
        } catch (error) {
            console.error('Error in updating profile: ', error);
            throw new InternalServerErrorException('Failed to update profile');
        }
    }

    async searchUserByName(name: string): Promise<User[]> {
        const users = await this.userModel.find({ username: { $regex: name, $options: 'i' } }).exec();
        if (!users || users.length === 0) {
            throw new NotFoundException('No users found with the provided name.');
        }
        return users;
    }

    async fetchUsers(): Promise<User[]> {
        try {
            const users = await this.userModel.find().exec();
            if (!users || users.length === 0) {
                throw new NotFoundException('No users found.');
            }
            return users;
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch users.');
        }
    }

    async findUserById(userId: string): Promise<User> {
        try {
            const user = await this.userModel.findById(userId).exec();
            if (!user) {
                throw new NotFoundException('User not found.');
            }
            return user;
        } catch (error) {
            throw new InternalServerErrorException('Failed to find user.');
        }
    }

    async sendForgotPasswordEmail(data: ForgotPasswordDto): Promise<{ message: string } | { error: string }> {
        // Validate email address
        try {
            const email = data.email;
            console.log("email to forgot password ", email);
            const user = await this.userModel.findOne({ email });          // Send email using the EmailService
            console.log("userrrrrrrrrrrrrrr", user);
            if(!user)
                {
                    return {message : "User not found"}
                }
                const resetToken = await this.resetToken(String(user._id), user.username);
                console.log("reset toen --", resetToken);
            const mailOptions = {
            from: this.configService.get('EMAIL_USER'),
            to: email,
            subject: 'Token to reset your password',
            text: `I you want to reset your password then click on the given below link ,else ignore this email :: http://localhost:3000/auth/resetPassword/?userId=${user._id}&token=${resetToken.reset_token}`,
          };
          await this.transporter.sendMail(mailOptions);
          return { message: 'Email sent successfully' };
        } catch (error) {

            console.log("error0---",error);
            
          throw new Error('Internal server error');
        }
      }

    async resetToken(
        userid: string,
        username: string,
      ): Promise<{ reset_token: string }> {
        const payload = {
          id: userid,
          username,
        };
        const token = this.jwtService.sign(payload, {
          expiresIn: '5m',
          secret: process.env.JWT_SECRET,
        });
        return {
          reset_token: token,
        };
      }

      async resetPassword(resetinfo: ResetPassworddto, id: string) {
        try {
          // Verify reset token
          console.log("reset service ---------", resetinfo);
          const hash = await bcrypt.hash(resetinfo.currentPassword, 10);
          console.log(hash, id);
          const updatePassword = await this.userModel.findByIdAndUpdate(
            id,
            { password: hash },
            { new: true }
          );
      
          if (!updatePassword)
            throw new HttpException('Password is not updated.', 404);
      
          return {
            success: true,
            message: 'Successfully password has been updated',
            statusCode: 200, // Success status code
          };
        } catch (error) {
          // Handle errors and return failure message
          console.error('Password reset failed:', error.message);
          return {
            success: false,
            message: 'Password reset failed. Please try again.',
            statusCode: 404, // Failure status code
          };
        }
      }
      

      async updatePassword(newpassword: UpdatePasswordDto) {
        try {
            
          const { email, current_password, confirm_password } = newpassword;
          console.log( email, current_password, confirm_password);
          
          const user = await this.userModel.findOne({ email });
          if (!user) {
            throw new Error('Invalid Email');
          }
          const isCorrectPass = await bcrypt.compare(
            current_password,
            user.password,
          );
          if (!isCorrectPass) {
            throw new Error('Your Current Password is Wrong');
          }
          const hashedPassword = await bcrypt.hash(confirm_password, 10);
          user.password = hashedPassword;
          await user.save();
          return {
            success: true,
            message: 'Your Password Has Been Updated Successfully..!',
          };
        } catch (error) {
          console.error('Password Has Not Updated', error.message);
          throw error;
        }
      }
    
}
