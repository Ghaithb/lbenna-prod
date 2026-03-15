import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqDto, UpdateFaqDto } from './fAQ.dto';

@Injectable()
export class FaqService {
    constructor(private prisma: PrismaService) { }

    async findAll(isAdmin = false) {
        return this.prisma.fAQ.findMany({
            where: isAdmin ? {} : { isActive: true },
            orderBy: { order: 'asc' },
        });
    }

    async findOne(id: string) {
        const fAQ = await this.prisma.fAQ.findUnique({ where: { id } });
        if (!fAQ) throw new NotFoundException('FAQ non trouvée');
        return fAQ;
    }

    async create(data: CreateFaqDto) {
        return this.prisma.fAQ.create({ data });
    }

    async update(id: string, data: UpdateFaqDto) {
        return this.prisma.fAQ.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.fAQ.delete({ where: { id } });
    }
}
