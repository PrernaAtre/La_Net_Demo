import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSignupDto } from "../auth/dto/signupDto.dto";
import { UserLoginDto } from 'src/auth/dto/loginDto.dto';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) 
        private userModel: Model<User>,
        private jwtService: JwtService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async createUser(imagePath:string, userSignupDto: UserSignupDto): Promise<string> {
        try {
            const { username, email, password, confirm_password, profile_image } = userSignupDto;
            const checkEmail = await this.userModel.findOne({email})
            if(checkEmail){
                return "Email is duplicate..";
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            
            if(password !== confirm_password)
            {
                return "your password and confirm password are not same";
            }
            console.log('---------',userSignupDto)
            
            const image_url = await this.cloudinaryService.uploadProfileImage(imagePath)
            console.log('---121',imagePath);
            await this.userModel.create({
                username,
                email,
                password: hashedPassword,
                profile_image:image_url?.url,
            });
            return "user register succesfully";
        } catch (error) {
            console.log('error',error)
            if (error.code == '11000') {
                throw new ConflictException('Duplicate data input')
            }
            else {
                throw new InternalServerErrorException();
            }
        }
    }

    
    async loginUser(userLoginDto : UserLoginDto) : Promise<{ token: string ,user:UserLoginDto}>
    {
        try
        {
            const {email, password} = userLoginDto;
            const user = await this.userModel.findOne({email : email});
            if(user && (await bcrypt.compare(password, user.password)))
            {
                const token = this.jwtService.sign({ id: user._id });
                return { token,user };
            }
            else
            {
                throw new UnauthorizedException("Invalid Email And Password");
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
}
