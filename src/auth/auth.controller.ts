import { Body, Controller, Post, Res, Get, UseGuards, UseInterceptors, UploadedFile, HttpException, HttpStatus, NotFoundException, Query, Param, Put, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignupDto } from './dto/signupDto.dto';
import { User } from './schema/user.schema';
import { UserLoginDto } from './dto/loginDto.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateProfileDto } from './dto/updateProfileDto.dto';
import { ObjectId } from 'mongodb'; // Import ObjectId type
import { AuthGuard } from './jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { EmailService } from './email.service';
import { ResetPassworddto, UpdatePasswordDto } from './dto/resertPassword.dto';
import { error } from 'console';


const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const uniqueFilename = Date.now() + extname(file.originalname);
        cb(null, uniqueFilename);
    },
});

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly emailService: EmailService) { }

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
        const jwt = await this.authService.loginUser(userLoginDto);
        console.log("jwttttt---", jwt.token);
        response.cookie('token', jwt.token, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 365 * 24 * 60 * 1000),
            sameSite: "none"
        }).send({ jwt });
        // response.send({ jwt });
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


    @Post('/forgotPassword')
    async ForgotPass(
        @Body() data: ForgotPasswordDto,
    ): Promise<{ message: string } | { error: string }> {
        try {
            console.log("datttttttt", data);
            
            return await this.authService.sendForgotPasswordEmail(data);
        } catch (error) {
            throw new HttpException(
                error.message || 'internal server error',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Patch('/resetPassword/:id')
    async resetPassword(@Body() resetData: ResetPassworddto,@Param('id') id:string) {
        try
        {
            console.log("reset data", resetData);
            return this.authService.resetPassword(resetData,id);
        }
        catch(err)
        {
            console.log(err);
        }
    }

    @Patch('/updatePassword')
    async updatePassword(@Body() updatepassworddto: UpdatePasswordDto) {
      try {
        console.log("updatepassworddto------", updatepassworddto);
        
        const result = await this.authService.updatePassword(updatepassworddto);
        console.log(result);
        return result;
      } catch (error) {
        throw new HttpException(
          error.message || 'Internal server Error',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    @Post("/verifyToken/:userId/:token")
    async verifyUser(@Param('userId') userId : string, @Param('token') token : string)
    {
        try
        {
            console.log(userId, token);
            const result = await this.authService.verifyUser(userId, token);   
            return result;
        }
        catch(err)
        {
            return new HttpException(err.message || 'Internal Server Error', HttpStatus.BAD_REQUEST)
        }
    }
    // @Get('/fetchUsers')
    // @UseGuards(AuthGuard()) // Guard to protect this endpoint
    // async fetchUsers(): Promise<User[]> {
    //     try {
    //         return await this.authService.fetchUsers();
    //     } catch (error) {
    //         throw new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }


}
