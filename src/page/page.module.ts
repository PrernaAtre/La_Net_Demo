import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/auth/schema/user.schema';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { PageSchema } from './dto/Page.dto';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Page', schema: PageSchema }, { name: 'User', schema: UserSchema }]),
  ],
  controllers: [PageController],
  providers: [PageService]
})

export class PageModule { }
