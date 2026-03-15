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

    async findTree() {
        const allCats = await this.prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        serviceOffers: true,
                        portfolioItems: true,
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        return this.buildTree(allCats);
    }

    private buildTree(categories: any[], parentId: string | null = null): any[] {
        return categories
            .filter(cat => cat.parentId === parentId)
            .map(cat => ({
                ...cat,
                children: this.buildTree(categories, cat.id),
            }));
    }

    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
            },
        });
        if (!category) throw new NotFoundException(`Category #${id} not found`);
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        return this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
        });
    }

    async remove(id: string) {
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
