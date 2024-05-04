import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            console.log("Request Object:", request);
            
            const token = request.cookies && request.cookies['token'];
            console.log("Token from Cookie:", token);
            

            if (!token) {
                throw new UnauthorizedException("You are not authenticated");
            }

            // Assuming verifyToken returns a boolean indicating token validity
            return this.authService.verifyToken(token);
        } catch (error) {
            // Catch any errors that occur during token verification
            console.error("Error in AuthGuard:", error);
            throw new UnauthorizedException("Authentication failed");
        }
    }
}
