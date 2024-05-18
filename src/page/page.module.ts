import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/models/user.schema';
import { PageSchema } from '../models/page.schema';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { CommonService } from 'src/common/common.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { CheckPublishLimitMiddleware } from 'src/middleware/page.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Page', schema: PageSchema }, { name: 'User', schema: UserSchema }]), AuthModule, NotificationsModule
  ],
  controllers: [PageController],
  providers: [PageService,CommonService]
})

export class PageModule { 
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckPublishLimitMiddleware)
      .forRoutes('publish');
  }

}
