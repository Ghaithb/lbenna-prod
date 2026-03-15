import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveRequestDto, UpdateLeaveStatusDto } from './dto/leave-request.dto';

@Controller('leaves')
export class LeavesController {
    constructor(private readonly leavesService: LeavesService) { }

    @Post()
    create(@Body() dto: CreateLeaveRequestDto) {
        return this.leavesService.create(dto);
    }

    @Get()
    findAll(@Query('employeeId') employeeId?: string) {
        return this.leavesService.findAll(employeeId);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateLeaveStatusDto
    ) {
        return this.leavesService.updateStatus(id, dto);
    }
}
