import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/loginDto.dto';
import { ResetPasswordDto } from './dto/resetpassword.dto';
import { UserSignupDto } from './dto/signupDto.dto';
import { AuthGuard } from './jwt-auth.guard'; // aa barabar chhe?
export interface AuthenticatedRequest extends Request {
    params: any;
    currentUser: any;
}

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const uniqueFilename = Date.now() + extname(file.originalname);
        cb(null, uniqueFilename);
    },
});

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private readonly cloudinaryService: CloudinaryService) { }

    @Post('/signup')
    @UseInterceptors(FileInterceptor('profile_image', { storage }))
    async signUp(@Body() userSignupDto: UserSignupDto, @UploadedFile() profile_image: Express.Multer.File) {
        try {
            if (!profile_image) {
                throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
            }
            console.log("profile_image: ", profile_image, "userSignupDto: ", userSignupDto)
            return this.authService.createUser(profile_image.path, userSignupDto);
        }
        catch (error) {
            console.log("error in uploading image : ", error);
            throw new HttpException('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/login')
    async login(@Body() userLoginDto: UserLoginDto, @Res({ passthrough: true }) response: Response) {
        return  await this.authService.loginUser(userLoginDto);
    }

    @Post('/reset-password')
    @UseGuards(AuthGuard)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Req() { currentUser }: AuthenticatedRequest): Promise<void> {
        await this.authService.resetPassword(resetPasswordDto, currentUser);
    }
}
