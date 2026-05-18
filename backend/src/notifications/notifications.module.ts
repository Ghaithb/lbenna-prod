import { Global, Module, Provider } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationService } from './notifications.service';
import { PrismaModule } from '../prisma/prisma.module';

const providers: Provider[] = [NotificationService];

// WebSockets are not supported on Vercel serverless
if (!process.env.VERCEL) {
  providers.push(NotificationsGateway);
}

@Global()
@Module({
  imports: [PrismaModule],
  providers,
  exports: providers,
})
export class NotificationsModule {}
