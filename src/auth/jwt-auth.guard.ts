
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/models/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
  //    @InjectModel("User")
  // private userModel: Model<User>
) {}

  async canActivate(
    context: ExecutionContext,
):Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log("token 000", request)//error na aavi ne?
    // const token = request.cookie['token']
    console.log("token",request.cookie)
    console.log("token from heaader -----",request.headers.authorization?.split(' ')[1]);

    const token = request.headers.authorization?.split(' ')[1];
    request.currentUser="fgbfgbfgbfgb"
    if (!token) {
      throw new UnauthorizedException("You are not authenticated");
    }
    const user=this.authService.verifyToken(token)
    request.currentUser=user
    return !!user;
  }
}



