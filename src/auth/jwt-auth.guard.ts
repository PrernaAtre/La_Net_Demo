
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ServerError } from 'src/common/utils/serverError';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(
    context: ExecutionContext,
):Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ServerError({code:401,message:"You are not authenticated"});
    }
    const user=this.authService.verifyToken(token)
    request.currentUser=user
    return !!user;
  }
}



