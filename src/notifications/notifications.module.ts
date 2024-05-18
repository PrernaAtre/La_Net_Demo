import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from 'src/models/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema },
  ])],
  providers: [NotificationsService, NotificationsGateway],
  exports:[NotificationsGateway,NotificationsService]
})
export class NotificationsModule {}
