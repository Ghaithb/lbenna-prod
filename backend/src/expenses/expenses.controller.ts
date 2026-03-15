import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Prisma, ExpenseCategory } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) { }

    @Post()
    create(@Body() data: Prisma.ExpenseCreateInput) {
        return this.expensesService.create(data);
    }

    @Get()
    findAll(
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('category') category?: ExpenseCategory,
        @Query('start') start?: string,
        @Query('end') end?: string,
    ) {
        const where: Prisma.ExpenseWhereInput = {};
        if (category) where.category = category;
        if (start || end) {
            where.date = {};
            if (start) where.date.gte = new Date(start);
            if (end) where.date.lte = new Date(end);
        }

        return this.expensesService.findAll({
            skip: skip ? Number(skip) : undefined,
            take: take ? Number(take) : undefined,
            where,
            orderBy: { date: 'desc' },
        });
    }

    @Get('stats')
    async getStats(@Query('start') start?: string, @Query('end') end?: string) {
        const startDate = start ? new Date(start) : undefined;
        const endDate = end ? new Date(end) : undefined;
        return this.expensesService.getStats(startDate, endDate);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.expensesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: Prisma.ExpenseUpdateInput) {
        return this.expensesService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.expensesService.remove(id);
    }
}
