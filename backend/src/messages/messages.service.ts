import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService) { }

    async create(createMessageDto: CreateMessageDto) {
        return this.prisma.message.create({
            data: createMessageDto,
        });
    }

    async findAll(includeArchived = false) {
        const where: any = {};
        if (!includeArchived) {
            where.isArchived = false;
        }
        return this.prisma.message.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.message.findUnique({
            where: { id },
        });
    }

    async markAsRead(id: string) {
        return this.prisma.message.update({
            where: { id },
            data: { isRead: true },
        });
    }

    async archive(id: string) {
        return this.prisma.message.update({
            where: { id },
            data: { isArchived: true },
        });
    }

    async reply(id: string, content: string) {
        return this.prisma.message.update({
            where: { id },
            data: {
                replyContent: content,
                repliedAt: new Date(),
                isRead: true
            },
        });
    }

    async remove(id: string) {
        return this.prisma.message.delete({
            where: { id },
        });
    }
}
