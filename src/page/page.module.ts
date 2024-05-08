import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/models/user.schema';
import { PageSchema } from '../models/Page.schema';
import { PageController } from './page.controller';
import { PageService } from './page.service';
// import { JwtStrategy } from 'src/auth/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Page', schema: PageSchema }, { name: 'User', schema: UserSchema }]), AuthModule
  ],
  controllers: [PageController],
  providers: [PageService]
})

export class PageModule { }
