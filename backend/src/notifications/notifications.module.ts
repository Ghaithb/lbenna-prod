import { Global, Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationService } from './notifications.service';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [NotificationsGateway, NotificationService],
  exports: [NotificationsGateway, NotificationService],
})
export class NotificationsModule { }