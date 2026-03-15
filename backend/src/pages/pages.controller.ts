import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('pages')
@Controller('pages')
export class PagesController {
    constructor(private readonly pagesService: PagesService) { }

    @Get()
    @ApiOperation({ summary: 'Get all pages' })
    async findAll(@Query('isAdmin') isAdmin?: string) {
        return this.pagesService.findAll(isAdmin === 'true');
    }

    @Get('menu')
    @ApiOperation({ summary: 'Get pages for menu' })
    async findMenuPages() {
        return this.pagesService.findMenuPages();
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get page by slug' })
    async findBySlug(
        @Param('slug') slug: string,
        @Query('isAdmin') isAdmin?: string,
    ) {
        return this.pagesService.findBySlug(slug, isAdmin === 'true');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get page by ID' })
    async findOne(@Param('id') id: string) {
        return this.pagesService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create page (Admin)' })
    async create(@Body() data: CreatePageDto) {
        return this.pagesService.create(data);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update page (Admin)' })
    async update(@Param('id') id: string, @Body() data: UpdatePageDto) {
        return this.pagesService.update(id, data);
    }

    @Put(':id/publish')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Toggle publish status (Admin)' })
    async togglePublish(@Param('id') id: string) {
        return this.pagesService.togglePublish(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete page (Admin)' })
    async delete(@Param('id') id: string) {
        return this.pagesService.delete(id);
    }
}
