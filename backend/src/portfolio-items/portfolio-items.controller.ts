import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PortfolioItemsService } from './portfolio-items.service';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';
import { UpdatePortfolioItemDto } from './dto/update-portfolio-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
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
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    create(
        @Body() createDto: CreatePortfolioItemDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.portfolioItemsService.create(createDto, file);
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
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    update(
        @Param('id') id: string,
        @Body() updateDto: UpdatePortfolioItemDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.portfolioItemsService.update(id, updateDto, file);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete portfolio item (Admin)' })
    remove(@Param('id') id: string) {
        return this.portfolioItemsService.remove(id);
    }
}
