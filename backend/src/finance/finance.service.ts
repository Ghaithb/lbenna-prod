import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats(startDate?: Date, endDate?: Date) {
        const start = startDate || new Date(new Date().getFullYear(), 0, 1);
        const end = endDate || new Date();

        // 1. Revenue (Completed Bookings)
        const bookings = await this.prisma.booking.findMany({
            where: {
                status: 'COMPLETED',
                createdAt: { gte: start, lte: end }
            },
            select: { serviceOffer: { select: { price: true } } }
        });

        const totalRevenue = bookings.reduce((sum, b) => sum + (b.serviceOffer?.price || 0), 0);

        // 2. Expenses (Overhead)
        const expenses = await this.prisma.expense.aggregate({
            where: { date: { gte: start, lte: end } },
            _sum: { amount: true }
        });

        const totalExpenses = expenses._sum.amount || 0;
        const netProfit = totalRevenue - totalExpenses;

        const monthlyStats = new Array(12).fill(0).map(() => ({ revenue: 0, count: 0, pos: 0, online: 0 }));
        // Simplified monthly stats for bookings
        const allBookings = await this.prisma.booking.findMany({
            where: {
                status: 'COMPLETED',
                createdAt: { gte: start, lte: end }
            },
            select: { createdAt: true, serviceOffer: { select: { price: true } } }
        });

        allBookings.forEach(booking => {
            const month = booking.createdAt.getMonth();
            monthlyStats[month].revenue += (booking.serviceOffer?.price || 0);
            monthlyStats[month].count += 1;
        });

        return {
            overview: {
                totalRevenue,
                totalExpenses,
                netProfit,
                grossProfit: totalRevenue, // Simplification car pas de COGS séparé
                margin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
                totalPurchases: 0 // Placeholder
            },
            charts: {
                monthly: monthlyStats
            }
        };
    }

    async getTransactions(startDate: Date, endDate: Date) {
        const [bookings, expenses] = await Promise.all([
            this.prisma.booking.findMany({
                where: { createdAt: { gte: startDate, lte: endDate }, status: 'COMPLETED' },
                include: { serviceOffer: true }
            }),
            this.prisma.expense.findMany({
                where: { date: { gte: startDate, lte: endDate } },
                select: { category: true, description: true, amount: true, date: true }
            })
        ]);

        return { bookings, expenses };
    }
}
