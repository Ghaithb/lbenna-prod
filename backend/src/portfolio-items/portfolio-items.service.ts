import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';
import { UpdatePortfolioItemDto } from './dto/update-portfolio-item.dto';
import { StorageService } from '../upload/storage.service';

@Injectable()
export class PortfolioItemsService {
    constructor(
        private prisma: PrismaService,
        private storageService: StorageService
    ) { }

    async create(createDto: CreatePortfolioItemDto, file?: Express.Multer.File, galleryFiles?: Express.Multer.File[]) {
        const { categoryId, ...data } = createDto;

        let coverUrl = data.coverUrl;

        // If a file is uploaded, it takes precedence over the provided URL
        if (file) {
            coverUrl = await this.storageService.uploadFile(file, 'portfolio');
        }

        let galleryUrls = Array.isArray(data.galleryUrls) ? data.galleryUrls : [];
        if (galleryFiles && galleryFiles.length > 0) {
            const uploadedGallery = await Promise.all(
                galleryFiles.map(f => this.storageService.uploadFile(f, 'portfolio/gallery'))
            );
            galleryUrls = [...galleryUrls, ...uploadedGallery];
        }

        return this.prisma.portfolioItem.create({
            data: {
                ...data,
                coverUrl: coverUrl || '', // Ensure we have a string if no file/URL provided
                galleryUrls,
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

    async update(id: string, updateDto: UpdatePortfolioItemDto, file?: Express.Multer.File, galleryFiles?: Express.Multer.File[]) {
        const { categoryId, ...data } = updateDto;

        let coverUrl = data.coverUrl;

        if (file) {
            coverUrl = await this.storageService.uploadFile(file, 'portfolio');
        }

        let galleryUrls = data.galleryUrls;
        if (galleryFiles && galleryFiles.length > 0) {
            const uploadedGallery = await Promise.all(
                galleryFiles.map(f => this.storageService.uploadFile(f, 'portfolio/gallery'))
            );
            const existingUrls = Array.isArray(data.galleryUrls) ? data.galleryUrls : [];
            galleryUrls = [...existingUrls, ...uploadedGallery];
        }

        return this.prisma.portfolioItem.update({
            where: { id },
            data: {
                ...data,
                ...(coverUrl && { coverUrl }),
                ...(galleryUrls && { galleryUrls }),
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
