import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, action: string, resource: string, payload?: any) {
        return this.prisma.auditLog.create({
            data: {
                userId,
                action,
                resource,
                payload,
            },
        });
    }

    async findAll() {
        return this.prisma.auditLog.findMany({
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
            orderBy: { timestamp: 'desc' },
            take: 100,
        });
    }
}
