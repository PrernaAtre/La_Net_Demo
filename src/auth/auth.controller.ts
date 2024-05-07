import { Body, Controller, Post, Res, Get, UseGuards, UseInterceptors, UploadedFile, HttpException, HttpStatus, NotFoundException, Query, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignupDto } from './dto/signupDto.dto';
import { User } from './schema/user.schema';
import { UserLoginDto } from './dto/loginDto.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { diskStorage } from 'multer';
import { AuthGuard } from './jwt-auth.guard' // aa barabar chhe?
import { extname } from 'path';
import { UpdateProfileDto } from './dto/updateProfileDto.dto';
import { ObjectId } from 'mongodb'; // Import ObjectId type


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
    @UseInterceptors(FileInterceptor('file', { storage }))
    async signUp(@Body() userSignupDto: UserSignupDto, @UploadedFile() file: Express.Multer.File): Promise<string> {

        try {
            if (!file) {
                throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
            }
            return this.authService.createUser(file.path, userSignupDto);
        }
        catch (error) {
            console.log("error in uploading image : ", error);
            throw new HttpException('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/login')
    async login(@Body() userLoginDto: UserLoginDto, @Res({ passthrough: true }) response: Response) {
        const { token, user } = await this.authService.loginUser(userLoginDto);
        response.cookie('token', token, {
            httpOnly: true, secure: true,
            sameSite: 'none',
        });

        response.status(HttpStatus.OK).json({ token, user });
    }

    @Get('/test')
    @UseGuards(AuthGuard)
    test(@Res() response: Response): void {
        try {
            response.status(200).send("Hello from Home");
        }
        catch (err) {
            response.status(200).send("wrong");
        }
    }

    @Put('/update/:userId')  
    @UseInterceptors(FileInterceptor('file'))
    async updateProfile(
        @Param('userId') userId: string,
        @Body() updateProfileDto: UpdateProfileDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Object> {
        try {
            if (!file) {
                throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
            }
            return this.authService.updateProfile(file.path, userId, updateProfileDto);
        } catch (error) {
            console.error('Error in updating profile: ', error);
            throw new HttpException('Failed to update profile', HttpStatus.INTERNAL_SERVER_ERROR);
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

    @Get('/fetchUsers')
    @UseGuards(AuthGuard) // Guard to protect this endpoint ha to aaya  AuthGuard rakhje me je mokalyu e ane frontend side thi jyare api call karavde tyare credentials includes kari deje 
    async fetchUsers(): Promise<User[]> {
        try {
            return await this.authService.fetchUsers();
        } catch (error) {
            throw new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/getUserByEmail')
    @UseGuards(AuthGuard) // Guard to protect this endpoint ha to aaya  AuthGuard rakhje me je mokalyu e ane frontend side thi jyare api call karavde tyare credentials includes kari deje 
    async getUserByEmail(@Query('slug') slug: string): Promise<User[]> {
        try {
            return await this.authService.getUserByEmail(slug);
        } catch (error) {
            throw new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
