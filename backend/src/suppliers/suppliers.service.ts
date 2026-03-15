import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SuppliersService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.SupplierCreateInput) {
        return this.prisma.supplier.create({ data });
    }

    async findAll(params?: {
        skip?: number;
        take?: number;
        where?: Prisma.SupplierWhereInput;
        orderBy?: Prisma.SupplierOrderByWithRelationInput;
    }) {
        const { skip, take, where, orderBy } = params || {};
        const [data, total] = await Promise.all([
            this.prisma.supplier.findMany({ skip, take, where, orderBy }),
            this.prisma.supplier.count({ where }),
        ]);
        return { data, total };
    }

    async findOne(id: string) {
        const supplier = await this.prisma.supplier.findUnique({
            where: { id },
            include: {
                purchaseOrders: { orderBy: { createdAt: 'desc' }, take: 5 },
            },
        });
        if (!supplier) throw new NotFoundException(`Supplier ${id} not found`);
        return supplier;
    }

    async update(id: string, data: Prisma.SupplierUpdateInput) {
        try {
            return await this.prisma.supplier.update({ where: { id }, data });
        } catch (error) {
            if (error.code === 'P2025') throw new NotFoundException(`Supplier ${id} not found`);
            throw error;
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.supplier.delete({ where: { id } });
        } catch (error) {
            if (error.code === 'P2025') throw new NotFoundException(`Supplier ${id} not found`);
            throw error;
        }
    }

    async getStats() {
        const total = await this.prisma.supplier.count();
        const active = await this.prisma.supplier.count({ where: { isActive: true } });
        const purchaseOrders = await this.prisma.purchaseOrder.count();
        return { total, active, purchaseOrders, inactive: total - active };
    }
}
