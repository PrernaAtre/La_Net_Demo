import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CommonService } from 'src/common/common.service';
import { BcryptService } from 'src/common/bcrypt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/models/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QuickNoteModule } from 'src/quick-note/quick-note.module';
import { QuickNoteSchema } from 'src/models/quickNote.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema },{ name: 'QuickNote', schema: QuickNoteSchema }]),
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
  ],
  controllers: [UserController],
  providers: [UserService,AuthService,JwtStrategy,CloudinaryService,CommonService,BcryptService]
})
export class UserModule {}
