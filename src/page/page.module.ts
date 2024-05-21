import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/models/user.schema';

import { PageController } from './page.controller';
import { PageService } from './page.service';
import { CommonService } from 'src/common/common.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
// import { CheckPublishLimitMiddleware } from 'src/middleware/page.middleware';
import { PageSchema } from 'src/models/Page.schema';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationSchema } from 'src/models/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Page', schema: PageSchema }, { name: 'User', schema: UserSchema },{ name: 'Notification', schema: NotificationSchema }]), AuthModule, NotificationsModule
  ],
  controllers: [PageController],
  providers: [PageService,CommonService,NotificationsService]
})

export class PageModule { 
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(CheckPublishLimitMiddleware)
  //     .forRoutes('publish');
  // }

}
