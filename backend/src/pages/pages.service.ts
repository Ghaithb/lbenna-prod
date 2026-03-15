import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreatePageDto) {
        return this.prisma.page.create({
            data,
        });
    }

    async findAll(isAdmin: boolean = false) {
        const where = isAdmin ? {} : { isPublished: true };

        return this.prisma.page.findMany({
            where,
            orderBy: [
                { menuOrder: 'asc' },
                { createdAt: 'desc' },
            ],
        });
    }

    async findMenuPages() {
        return this.prisma.page.findMany({
            where: {
                isPublished: true,
                showInMenu: true,
            },
            select: {
                id: true,
                title: true,
                slug: true,
                menuOrder: true,
            },
            orderBy: {
                menuOrder: 'asc',
            },
        });
    }

    async findBySlug(slug: string, isAdmin: boolean = false) {
        const where: any = { slug };
        if (!isAdmin) {
            where.isPublished = true;
        }

        const page = await this.prisma.page.findUnique({
            where,
        });

        if (!page) {
            throw new NotFoundException(`Page with slug "${slug}" not found`);
        }

        return page;
    }

    async findOne(id: string) {
        const page = await this.prisma.page.findUnique({
            where: { id },
        });

        if (!page) {
            throw new NotFoundException(`Page with ID "${id}" not found`);
        }

        return page;
    }

    async update(id: string, data: UpdatePageDto) {
        return this.prisma.page.update({
            where: { id },
            data,
        });
    }

    async togglePublish(id: string) {
        const page = await this.findOne(id);

        return this.prisma.page.update({
            where: { id },
            data: {
                isPublished: !page.isPublished,
            },
        });
    }

    async delete(id: string) {
        return this.prisma.page.delete({
            where: { id },
        });
    }
}
