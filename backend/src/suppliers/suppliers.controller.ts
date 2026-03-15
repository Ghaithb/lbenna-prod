import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('suppliers')
@Controller('suppliers')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new supplier' })
    create(@Body() data: Prisma.SupplierCreateInput) {
        return this.suppliersService.create(data);
    }

    async findAll(
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('query') query?: string,
    ) {
        const result = await this.suppliersService.findAll({
            skip: skip ? Number(skip) : undefined,
            take: take ? Number(take) : undefined,
            where: query ? {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                    { category: { contains: query, mode: 'insensitive' } },
                ]
            } : undefined,
            orderBy: { name: 'asc' },
        });
        return result.data; // Le frontend attend un tableau
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get supplier statistics' })
    getStats() {
        return this.suppliersService.getStats();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get supplier by ID' })
    findOne(@Param('id') id: string) {
        return this.suppliersService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update supplier' })
    update(@Param('id') id: string, @Body() data: Prisma.SupplierUpdateInput) {
        return this.suppliersService.update(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete supplier' })
    remove(@Param('id') id: string) {
        return this.suppliersService.remove(id);
    }
}
