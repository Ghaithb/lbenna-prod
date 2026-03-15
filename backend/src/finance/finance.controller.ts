import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('finance')
@Controller('finance')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Get financial dashboard stats' })
    async getDashboard(@Query('start') start?: string, @Query('end') end?: string) {
        const startDate = start ? new Date(start) : undefined;
        const endDate = end ? new Date(end) : undefined;

        return this.financeService.getDashboardStats(startDate, endDate);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Alias for dashboard stats' })
    async getStats(@Query('start') start?: string, @Query('end') end?: string) {
        return this.getDashboard(start, end);
    }

    @Get('transactions')
    @ApiOperation({ summary: 'Get list of transactions for export' })
    async getTransactions(@Query('start') start: string, @Query('end') end: string) {
        return this.financeService.getTransactions(new Date(start), new Date(end));
    }
}
