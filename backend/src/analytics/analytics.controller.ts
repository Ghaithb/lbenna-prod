import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('summary')
    @ApiOperation({ summary: 'Get global analytics summary (Admin)' })
    async getSummary() {
        return this.analyticsService.getSummary();
    }

    @Get('revenue')
    @ApiOperation({ summary: 'Get revenue by month (Admin)' })
    async getRevenueByMonth() {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
        return months.map(month => ({ month, revenue: 0, count: 0, pos: 0, online: 0 }));
    }

    @Get('events')
    @ApiOperation({ summary: 'Get recent activity events (Admin)' })
    async getEvents(@Query('limit') limit?: string) {
        return this.analyticsService.getEvents(limit ? parseInt(limit) : 50);
    }

    @Get('upcoming')
    @ApiOperation({ summary: 'Get upcoming bookings (Admin)' })
    async getUpcomingBookings(@Query('limit') limit?: string) {
        return this.analyticsService.getUpcomingBookings(limit ? parseInt(limit) : 5);
    }
}
