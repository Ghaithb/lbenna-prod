import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';
import { UpdatePortfolioItemDto } from './dto/update-portfolio-item.dto';

@Injectable()
export class PortfolioItemsService {
    constructor(private prisma: PrismaService) { }

    async create(createDto: CreatePortfolioItemDto) {
        const { categoryId, ...data } = createDto;

        return this.prisma.portfolioItem.create({
            data: {
                ...data,
                ...(categoryId && { categoryObject: { connect: { id: categoryId } } }),
            },
        });
    }

    async findAll() {
        return this.prisma.portfolioItem.findMany({
            include: { categoryObject: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const item = await this.prisma.portfolioItem.findUnique({
            where: { id },
            include: { categoryObject: true },
        });
        if (!item) {
            throw new NotFoundException(`Portfolio Item #${id} not found`);
        }
        return item;
    }

    async update(id: string, updateDto: UpdatePortfolioItemDto) {
        const { categoryId, ...data } = updateDto;
        return this.prisma.portfolioItem.update({
            where: { id },
            data: {
                ...data,
                ...(categoryId && { categoryObject: { connect: { id: categoryId } } }),
            },
        });
    }

    async remove(id: string) {
        return this.prisma.portfolioItem.delete({
            where: { id },
        });
    }
}
