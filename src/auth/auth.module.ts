import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User,UserSchema } from './schema/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';


@Module({
  imports:[
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports : [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
      const jwtSecret = config.get<string>('JWT_SECRET');
      const jwtExpire = config.get<string | number>('JWT_EXPIRE');
      console.log('JWT Secret:', jwtSecret);
      console.log('JWT Expire:', jwtExpire);
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRE'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,CloudinaryService],
  exports: [JwtStrategy, PassportModule, AuthService]
})
export class AuthModule {}
