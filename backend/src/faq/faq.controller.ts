import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto, UpdateFaqDto } from './faq.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('faqs')
export class FaqController {
    constructor(private readonly faqService: FaqService) { }

    @Get()
    async findAll(@Query('isAdmin') isAdmin: string) {
        return this.faqService.findAll(isAdmin === 'true');
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.faqService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async create(@Body() createFaqDto: CreateFaqDto) {
        return this.faqService.create(createFaqDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
        return this.faqService.update(id, updateFaqDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async remove(@Param('id') id: string) {
        return this.faqService.remove(id);
    }
}
