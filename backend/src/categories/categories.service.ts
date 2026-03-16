import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(createCategoryDto: CreateCategoryDto) {
        const slug = createCategoryDto.slug || this.generateSlug(createCategoryDto.name);

        return this.prisma.category.create({
            data: {
                ...createCategoryDto,
                slug,
            },
        });
    }

    findAll() {
        return this.prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        serviceOffers: true,
                        portfolioItems: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }


    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!category) throw new NotFoundException(`Category #${id} not found`);
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        const data: any = { ...updateCategoryDto };

        if (data.name && !data.slug) {
            data.slug = this.generateSlug(data.name);
        }

        return this.prisma.category.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        // First check if there are children or linked items to provide a better error message
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        serviceOffers: true,
                        portfolioItems: true,
                    },
                },
            },
        });

        if (!category) throw new NotFoundException(`Category #${id} not found`);

        if (category._count.serviceOffers > 0 || category._count.portfolioItems > 0) {
            // Option 1: Prevent deletion (safer)
            // Option 2: Implement cascade manually or via Prisma schema change
            // For now, let's just allow it but be aware of foreign key constraints
        }

        return this.prisma.category.delete({
            where: { id },
        });
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}
