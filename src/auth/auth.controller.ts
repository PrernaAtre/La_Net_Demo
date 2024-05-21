import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Param,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { AuthenticatedRequest } from "src/common/utils/common.types";
import { ServerError } from "src/common/utils/serverError";
import { AuthService } from "./auth.service";
import { UserLoginDto } from "./dto/loginDto.dto";
import { ResetPasswordDto } from "./dto/resetpassword.dto";
import { UserSignupDto } from "./dto/signupDto.dto";
import { AuthGuard } from "./jwt-auth.guard";
import { ForgotPasswordDto } from "./dto/forgotPassword.dto";
import { ResetPassworddto } from "./dto/resertPassword.dto";

const storage = diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const uniqueFilename = Date.now() + extname(file.originalname);
    cb(null, uniqueFilename);
  },
});

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  @UseInterceptors(FileInterceptor("profile_image", { storage }))
  async signUp(
    @Body() userSignupDto: UserSignupDto,
    @UploadedFile() profile_image: Express.Multer.File
  ) {
    try {
      if (!profile_image) {
        throw new ServerError({ message: "No file uploaded", code: 400 });
      }
      return this.authService.createUser(profile_image.path, userSignupDto);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        "Something went wrong while trying to sign up."
      );
    }
  }

  @Post("/login")
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.loginUser(userLoginDto);
  }

  @Post('/forgotPassword')
  async ForgotPass(
      @Body() data: ForgotPasswordDto,
  ): Promise<{ message: string } | { error: string }> {
      console.log(data);
      try {
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
          return this.authService.resetPassword(resetData,id);
      }
      catch(err)
      {
          console.log(err);
      }
  }

  @Post("/verifyToken/:userId/:token")
  async verifyUser(@Param('userId') userId : string, @Param('token') token : string)
  {
      try
      {
          const result = await this.authService.verifyUser(userId, token);   
          return result;
      }
      catch(err)
      {
          return new HttpException(err.message || 'Internal Server Error', HttpStatus.BAD_REQUEST)
      }
  }
}
