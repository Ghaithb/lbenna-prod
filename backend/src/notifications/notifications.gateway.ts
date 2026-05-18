import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PrismaService } from '../prisma/prisma.service';
import { isOriginAllowed } from '../config/cors';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      callback(null, isOriginAllowed(origin));
    },
    credentials: true,
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  async handleConnection(client: any) {
    const userId = client.handshake.auth.token;
    if (userId) {
      client.join(`user:${userId}`);
      
      // Envoyer les notifications non lues à la connexion
      const notifications = await this.prisma.notification.findMany({
        where: {
          userId,
          isRead: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      client.emit('notifications', notifications);
    }
  }

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        ...createNotificationDto,
        isRead: false,
      },
    });

    this.server.to(`user:${createNotificationDto.userId}`).emit('notification', notification);
    return notification;
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }
}