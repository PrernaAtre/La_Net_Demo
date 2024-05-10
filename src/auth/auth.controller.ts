import {
    Body,
    Controller,
    HttpException,
    InternalServerErrorException,
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
import { AuthGuard } from "./jwt-auth.guard"; // aa barabar chhe?

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

  @Post("/reset-password")
  @UseGuards(AuthGuard)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<object> {
    return this.authService.resetPassword(resetPasswordDto, currentUser);
  }
}
