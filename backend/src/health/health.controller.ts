import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import * as os from 'os';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('health')
@Controller('health')
export class HealthController {
    constructor(private prisma: PrismaService) { }

    @Get()
    @ApiOperation({ summary: 'Health check endpoint' })
    async check() {
        const startTime = Date.now();

        try {
            // Check database connection
            await this.prisma.$queryRaw`SELECT 1`;
            const dbResponseTime = Date.now() - startTime;

            return {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                platform: process.platform,
                arch: process.arch,
                nodeVersion: process.version,
                database: {
                    status: 'connected',
                    responseTime: `${dbResponseTime}ms`,
                },
                system: {
                    cpus: os.cpus().length,
                    load: os.loadavg(),
                    freeMemory: `${Math.round(os.freemem() / 1024 / 1024)}MB`,
                    totalMemory: `${Math.round(os.totalmem() / 1024 / 1024)}MB`,
                    uptime: os.uptime(),
                },
                memory: {
                    used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
                    total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
                    rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
                },
                environment: process.env.NODE_ENV || 'development',
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error.message,
                database: {
                    status: 'disconnected',
                },
            };
        }
    }

    @Get('ready')
    @ApiOperation({ summary: 'Readiness check' })
    async ready() {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return { ready: true };
        } catch {
            return { ready: false };
        }
    }

    @Get('live')
    @ApiOperation({ summary: 'Liveness check' })
    live() {
        return { alive: true };
    }
}
