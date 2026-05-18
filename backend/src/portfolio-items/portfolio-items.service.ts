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

    async create(createDto: CreatePortfolioItemDto, file?: Express.Multer.File, galleryFiles?: Express.Multer.File[], videoFile?: Express.Multer.File) {
        const { categoryId, ...data } = createDto;

        console.log(`[SERVICE CREATE] Processing project: ${data.title}`);
        console.log(`[SERVICE CREATE] File present: ${!!file}, Gallery: ${galleryFiles?.length || 0}, Video: ${!!videoFile}`);

        let coverUrl = data.coverUrl;
        if (file) {
            try {
                coverUrl = await this.storageService.uploadFile(file, 'portfolio');
                console.log(`[SERVICE CREATE] Cover uploaded: ${coverUrl}`);
            } catch (err) {
                console.error(`[SERVICE CREATE] Cover upload failed: ${err.message}`);
                throw err;
            }
        }

        let galleryUrls = Array.isArray(data.galleryUrls) ? data.galleryUrls : [];
        if (galleryFiles && galleryFiles.length > 0) {
            try {
                const uploadedGallery = await Promise.all(
                    galleryFiles.map(f => this.storageService.uploadFile(f, 'portfolio/gallery'))
                );
                galleryUrls = [...galleryUrls, ...uploadedGallery];
                console.log(`[SERVICE CREATE] ${uploadedGallery.length} gallery items uploaded`);
            } catch (err) {
                console.error(`[SERVICE CREATE] Gallery upload failed: ${err.message}`);
                throw err;
            }
        }

        let videoUrl = data.videoUrl;
        if (videoFile) {
            try {
                videoUrl = await this.storageService.uploadFile(videoFile, 'portfolio/videos');
                console.log(`[SERVICE CREATE] Video uploaded: ${videoUrl}`);
            } catch (err) {
                console.error(`[SERVICE CREATE] Video upload failed: ${err.message}`);
                throw err;
            }
        }

        const payload: any = {
            title: data.title,
            coverUrl: coverUrl || '',
            galleryUrls,
            isActive: data.isActive !== undefined ? data.isActive : true,
        };
        if (data.category) payload.category = data.category;
        if (videoUrl !== undefined) payload.videoUrl = videoUrl;
        else if (data.videoUrl !== undefined) payload.videoUrl = data.videoUrl;
        if (data.eventDate) payload.eventDate = new Date(data.eventDate);
        if (categoryId) payload.categoryObject = { connect: { id: categoryId } };

        const project = await this.prisma.portfolioItem.create({
            data: payload,
        });
        
        console.log(`[SERVICE CREATE] Project ${project.id} saved in DB`);
        return project;
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

    async update(id: string, updateDto: UpdatePortfolioItemDto, file?: Express.Multer.File, galleryFiles?: Express.Multer.File[], videoFile?: Express.Multer.File) {
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

        let videoUrl = data.videoUrl;
        if (videoFile) {
            videoUrl = await this.storageService.uploadFile(videoFile, 'portfolio/videos');
        }

        const payload: any = {};
        if (data.title !== undefined) payload.title = data.title;
        if (data.category !== undefined) payload.category = data.category;
        if (data.isActive !== undefined) payload.isActive = data.isActive;
        if (coverUrl !== undefined) payload.coverUrl = coverUrl;
        if (galleryUrls !== undefined) payload.galleryUrls = galleryUrls;
        if (videoUrl !== undefined) payload.videoUrl = videoUrl;
        else if (data.videoUrl !== undefined) payload.videoUrl = data.videoUrl;
        if (data.eventDate !== undefined) payload.eventDate = new Date(data.eventDate);
        if (categoryId) payload.categoryObject = { connect: { id: categoryId } };

        return this.prisma.portfolioItem.update({
            where: { id },
            data: payload,
        });
    }

    async remove(id: string) {
        return this.prisma.portfolioItem.delete({
            where: { id },
        });
    }
}
