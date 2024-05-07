import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from "../models/user.schema";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    const { id } = payload;

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }
    console.log("user----",user)
    return user;
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.token) {
      console.log(req.cookies.token);
      console.log("token : ", req.cookies.token);
      return req.cookies.token;
    }
    return null;
  }
}