import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { UserLoginDto } from 'src/auth/dto/loginDto.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { BcryptService } from 'src/common/bcrypt.service';
import { CommonService } from 'src/common/common.service';
import { UserSignupDto } from "../auth/dto/signupDto.dto";
import { User } from '../models/user.schema';
import { ResetPasswordDto } from './dto/resetpassword.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly commonService: CommonService,
        private readonly bcryptService: BcryptService
    ) { }

    verifyToken(token: string): string | object {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

            if (!decoded || !decoded.id) {
                throw new Error('Invalid token');
            }

            return decoded;

        } catch (error) {
            // Handle invalid token or other errors
            throw new UnauthorizedException('Invalid token');
        }
    }

    async createUser(imagePath: string, userSignupDto: UserSignupDto): Promise<string> {
        try {
            const { username, email, password, profile_image } = userSignupDto;
            const checkEmail = await this.userModel.findOne({ email })
            if (checkEmail) {
                return "Email is duplicate..";
            }

            const hashedPassword = await this.bcryptService.hash(password);

            const image_url = await this.cloudinaryService.uploadProfileImage(imagePath)

            const user = await this.userModel.create({
                username,
                email,
                password: hashedPassword,
                profile_image: image_url?.url,
            });

            const stripeCustomer = await this.commonService.createCustomer({ email, name: username })
            await this.userModel.updateOne({ _id: user._id }, { $set: { customerId: stripeCustomer.id } })
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

    async resetPassword(resetPasswordDto: ResetPasswordDto, currentUser): Promise<string> {
        try {
            const user = await this.userModel.findOne({ _id: currentUser.id });

            const isMatch = await this.bcryptService.compare(resetPasswordDto.oldPassword, user.password);
            if (!isMatch) {
                throw new Error('Old password is incorrect');
            }

            if (!user)
                throw new Error("Invalid link: User not found");

            const hashedPassword = await this.bcryptService.hash(resetPasswordDto.newPassword);
            user.password = hashedPassword;
            await user.save();
            return "User password updated successfully.";
        } catch (error) {
            throw new Error(`Failed to reset password: ${error.message}`);
        }
    }


}
