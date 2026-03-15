import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Expense, ExpenseCategory, Prisma } from '@prisma/client';

@Injectable()
export class ExpensesService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.ExpenseCreateInput): Promise<Expense> {
        return this.prisma.expense.create({ data });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ExpenseWhereUniqueInput;
        where?: Prisma.ExpenseWhereInput;
        orderBy?: Prisma.ExpenseOrderByWithRelationInput;
    }): Promise<Expense[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.expense.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async findOne(id: string): Promise<Expense | null> {
        return this.prisma.expense.findUnique({ where: { id } });
    }

    async update(id: string, data: Prisma.ExpenseUpdateInput): Promise<Expense> {
        return this.prisma.expense.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Expense> {
        return this.prisma.expense.delete({ where: { id } });
    }

    async getStats(startDate?: Date, endDate?: Date) {
        const start = startDate || new Date(new Date().getFullYear(), 0, 1);
        const end = endDate || new Date();

        const byCategory = await this.prisma.expense.groupBy({
            by: ['category'],
            where: { date: { gte: start, lte: end } },
            _sum: { amount: true }
        });

        const total = await this.prisma.expense.aggregate({
            where: { date: { gte: start, lte: end } },
            _sum: { amount: true }
        });

        return {
            total: total._sum.amount || 0,
            byCategory
        };
    }
}
