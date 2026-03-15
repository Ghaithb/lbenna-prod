import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Prisma, Department } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('employees')
@Controller('employees')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new employee profile' })
    create(@Body() data: Prisma.EmployeeCreateInput) {
        return this.employeesService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'Get all employees' })
    findAll(
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('department') department?: Department,
        @Query('position') position?: string,
    ) {
        return this.employeesService.findAll({
            skip: skip ? Number(skip) : undefined,
            take: take ? Number(take) : undefined,
            where: {
                department: department,
                position: position ? { contains: position, mode: 'insensitive' } : undefined,
            }
        });
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get employee statistics' })
    getStats() {
        return this.employeesService.getStats();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get employee by ID' })
    findOne(@Param('id') id: string) {
        return this.employeesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update employee profile' })
    update(@Param('id') id: string, @Body() data: Prisma.EmployeeUpdateInput) {
        return this.employeesService.update(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete employee profile' })
    remove(@Param('id') id: string) {
        return this.employeesService.remove(id);
    }
}
