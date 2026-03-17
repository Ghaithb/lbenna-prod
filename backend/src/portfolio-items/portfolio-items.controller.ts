import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, UsePipes, ValidationPipe } from '@nestjs/common';
import { PortfolioItemsService } from './portfolio-items.service';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';
import { UpdatePortfolioItemDto } from './dto/update-portfolio-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@ApiTags('portfolio-items')
@Controller('portfolio-items')
export class PortfolioItemsController {
    constructor(private readonly portfolioItemsService: PortfolioItemsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
                title: { type: 'string' },
                description: { type: 'string' },
                category: { type: 'string' },
                categoryId: { type: 'string' },
                eventDate: { type: 'string', format: 'date-time' },
                isActive: { type: 'boolean' },
            },
        },
    })
    @ApiOperation({ summary: 'Create portfolio item (Admin) with direct upload' })
    @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file', maxCount: 1 },
        { name: 'gallery', maxCount: 20 },
        { name: 'video', maxCount: 1 },
    ], { storage: memoryStorage() }))
    create(
        @Body() createDto: CreatePortfolioItemDto,
        @UploadedFiles() files: { file?: Express.Multer.File[], gallery?: Express.Multer.File[], video?: Express.Multer.File[] }
    ) {
        console.log('[CONTROLLER CREATE] Data:', JSON.stringify(createDto));
        console.log('[CONTROLLER CREATE] Files Received:', Object.keys(files || {}));
        if (files?.file) console.log('[CONTROLLER CREATE] Cover File:', files.file[0].originalname);

        try {
            return this.portfolioItemsService.create(createDto, files?.file?.[0], files?.gallery, files?.video?.[0]);
        } catch (error) {
            console.error('[CONTROLLER CREATE] Error:', error.message);
            throw error;
        }
    }

    @Get()
    findAll() {
        return this.portfolioItemsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.portfolioItemsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Update portfolio item (Admin) with direct upload' })
    @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file', maxCount: 1 },
        { name: 'gallery', maxCount: 20 },
        { name: 'video', maxCount: 1 },
    ], { storage: memoryStorage() }))
    update(
        @Param('id') id: string,
        @Body() updateDto: UpdatePortfolioItemDto,
        @UploadedFiles() files: { file?: Express.Multer.File[], gallery?: Express.Multer.File[], video?: Express.Multer.File[] }
    ) {
        return this.portfolioItemsService.update(id, updateDto, files?.file?.[0], files?.gallery, files?.video?.[0]);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete portfolio item (Admin)' })
    remove(@Param('id') id: string) {
        return this.portfolioItemsService.remove(id);
    }
}
