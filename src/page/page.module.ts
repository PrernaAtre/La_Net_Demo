import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/models/user.schema';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { PageSchema } from '../models/Page.schema';
import { JwtUserMiddleware } from 'src/auth/auth.middleware';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CommonService } from 'src/common/common.service';
import { BcryptService } from 'src/common/bcrypt.service';
import { AuthModule } from 'src/auth/auth.module';
// import { JwtStrategy } from 'src/auth/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Page', schema: PageSchema }, { name: 'User', schema: UserSchema }]),AuthModule
  ],
  controllers: [PageController],
  providers: [PageService]
})

export class PageModule {}
