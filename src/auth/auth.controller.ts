import { Body, Controller, Post, Res, Get, UseGuards, UseInterceptors, UploadedFile, HttpException, HttpStatus, NotFoundException, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignupDto } from './dto/signupDto.dto';
import { User } from './schema/user.schema';
import { UserLoginDto } from './dto/loginDto.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueFilename = Date.now() + extname(file.originalname);
      cb(null, uniqueFilename);
    },
  });

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService,private readonly cloudinaryService: CloudinaryService){}

    @Post('/signup')
    @UseInterceptors(FileInterceptor('file',{storage}))
    async signUp(@Body() userSignupDto : UserSignupDto, @UploadedFile() file: Express.Multer.File) : Promise<string>
    {
       
        try
        {
            if (!file) {
                throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
            }
            
            
            // const result = await this.cloudinaryService.uploadProfileImage(file.path)
            // userSignupDto.profile_image = result.url;
            // const dta = await this.cloudinaryService.uploadProfileImage(userSignupDto.profile_image)
            // console.log("profile image : ",userSignupDto.profile_image);
            // userSignupDto.profile_image = result.url;
            return this.authService.createUser(file.path,userSignupDto);
        }
        catch(error)
        {
            console.log("error in uploading image : ", error);
            throw new HttpException('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/login')
    async login(@Body() userLoginDto : UserLoginDto, @Res({passthrough: true}) response: Response) : Promise<void>
    {
        const jwt = await this.authService.loginUser(userLoginDto);
        
        response.cookie('jwt', jwt, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 365 * 24 * 60 * 1000),
            domain: 'localhost',
        }).send({ status: 'ok', jwt, });    
    }

    @Get('/test')
    @UseGuards(AuthGuard())
    test(@Res() response: Response): void {
        try
        {
            response.status(200).send("Hello from Home");
        }
        catch(err)
        {
            response.status(200).send("wrong");
        } 
    }

    @Get('/search')
    async searchUser(@Query('name') name: string): Promise<User[]> {
        try {
            console.log(name);
            const users = await this.authService.searchUserByName(name);
            return users;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('No users found with the provided name.');
            }
            throw error;
        }
    }
}
