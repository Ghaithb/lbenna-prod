import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaveRequestDto, UpdateLeaveStatusDto } from './dto/leave-request.dto';
import { LeaveStatus } from '@prisma/client';

@Injectable()
export class LeavesService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateLeaveRequestDto) {
        return this.prisma.leaveRequest.create({
            data: {
                employeeId: data.employeeId,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                type: data.type,
                reason: data.reason,
            },
            include: { employee: true }
        });
    }

    async findAll(employeeId?: string) {
        return this.prisma.leaveRequest.findMany({
            where: employeeId ? { employeeId } : {},
            include: { employee: true },
            orderBy: { startDate: 'desc' },
        });
    }

    async updateStatus(id: string, dto: UpdateLeaveStatusDto) {
        const request = await this.prisma.leaveRequest.findUnique({
            where: { id },
            include: { employee: true }
        });

        if (!request) throw new NotFoundException('Leave request not found');

        // If approved, we could potentially update the employee status to 'LEAVE'
        // based on the current date, but let's keep it simple for now and just update the request.

        const updated = await this.prisma.leaveRequest.update({
            where: { id },
            data: {
                status: dto.status,
                adminNotes: dto.adminNotes
            }
        });

        if (dto.status === LeaveStatus.APPROVED) {
            // Update employee status if the leave is currently active
            const now = new Date();
            if (now >= request.startDate && now <= request.endDate) {
                await this.prisma.employee.update({
                    where: { id: request.employeeId },
                    data: { status: 'LEAVE' }
                });
            }
        }

        return updated;
    }
}
