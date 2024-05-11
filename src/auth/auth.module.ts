import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User,UserSchema } from '../models/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CommonService } from 'src/common/common.service';
import { BcryptService } from 'src/common/bcrypt.service';
import { QuickNoteModule } from 'src/quick-note/quick-note.module';
import { QuickNoteSchema } from 'src/quick-note/quickNote.schema';


@Module({
  imports:[

    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports : [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRE'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema },{ name: 'QuickNote', schema: QuickNoteSchema }]),
    forwardRef(()=>QuickNoteModule)

  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,CloudinaryService,CommonService,BcryptService, ],
  exports: [JwtStrategy, PassportModule, AuthService]
})
export class AuthModule {}
