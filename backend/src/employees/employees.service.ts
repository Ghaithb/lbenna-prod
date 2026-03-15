import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Employee, Department } from '@prisma/client';

@Injectable()
export class EmployeesService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.EmployeeCreateInput) {
        return this.prisma.employee.create({
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        });
    }

    async findAll(params?: {
        skip?: number;
        take?: number;
        cursor?: Prisma.EmployeeWhereUniqueInput;
        where?: Prisma.EmployeeWhereInput;
        orderBy?: Prisma.EmployeeOrderByWithRelationInput;
    }) {
        const { skip, take, cursor, where, orderBy } = params || {};
        return this.prisma.employee.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include: {
                user: {
                    select: {
                        email: true,
                        role: true,
                        isB2B: true,
                    }
                }
            }
        });
    }

    async findOne(userId: string) {
        const employee = await this.prisma.employee.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        email: true,
                        role: true,
                    }
                }
            }
        });

        if (!employee) {
            throw new NotFoundException(`Employee for user ${userId} not found`);
        }

        return employee;
    }

    async update(userId: string, data: Prisma.EmployeeUpdateInput) {
        try {
            // Check if profile exists
            const existing = await this.prisma.employee.findUnique({ where: { userId } });

            if (existing) {
                return await this.prisma.employee.update({
                    where: { userId },
                    data,
                    include: {
                        user: {
                            select: {
                                email: true,
                                role: true,
                            }
                        }
                    }
                });
            } else {
                // Automagically create if it doesn't exist but we want to set HR data
                const user = await this.prisma.user.findUnique({ where: { id: userId } });
                if (!user) throw new NotFoundException('User not found');

                return await this.prisma.employee.create({
                    data: {
                        ...(data as any),
                        firstName: user.firstName || 'Unknown',
                        lastName: user.lastName || 'Unknown',
                        email: user.email,
                        user: { connect: { id: userId } }
                    }
                });
            }
        } catch (error) {
            throw error;
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.employee.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Employee with ID ${id} not found`);
            }
            throw error;
        }
    }

    async getStats() {
        const total = await this.prisma.employee.count();
        const byDepartment = await this.prisma.employee.groupBy({
            by: ['department'],
            _count: {
                _all: true
            }
        });

        return {
            total,
            byDepartment: byDepartment.map(d => ({
                department: d.department,
                count: d._count._all
            }))
        };
    }
}
