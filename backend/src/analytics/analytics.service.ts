import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getSummary() {
        const [
            totalUsers,
            totalBookings,
            totalProjects,
            totalServiceOffers,
            totalMessages,
            revenueData
        ] = await Promise.all([
            this.prisma.user.count({ where: { role: 'CLIENT' } }),
            this.prisma.booking.count(),
            this.prisma.project.count(),
            this.prisma.serviceOffer.count(),
            this.prisma.message.count({ where: { isArchived: false } }),
            this.prisma.booking.aggregate({
                where: {
                    status: { in: ['CONFIRMED', 'COMPLETED'] }
                },
                _sum: {
                    paidAmount: true
                }
            })
        ]);

        return {
            totalUsers,
            totalBookings,
            totalProjects,
            totalServiceOffers,
            totalMessages,
            totalRevenue: revenueData._sum.paidAmount || 0,
        };
    }

    async getRevenueByMonth() {
        // Basic implementation for now, could be more dynamic
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
        return months.map(month => ({ month, revenue: 0, count: 0, pos: 0, online: 0 }));
    }

    async getEvents(limit: number = 50) {
        return this.prisma.auditLog.findMany({
            take: limit,
            orderBy: { timestamp: 'desc' },
            include: { user: { select: { firstName: true, lastName: true, email: true } } }
        });
    }

    async getUpcomingBookings(limit: number = 5) {
        return this.prisma.booking.findMany({
            where: {
                bookingDate: { gte: new Date() },
                status: { notIn: ['CANCELLED', 'REJECTED'] }
            },
            take: limit,
            orderBy: { bookingDate: 'asc' },
            include: {
                serviceOffer: { select: { title: true } }
            }
        });
    }
}
