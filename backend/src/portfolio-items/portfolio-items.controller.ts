import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PortfolioItemsService } from './portfolio-items.service';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';
import { UpdatePortfolioItemDto } from './dto/update-portfolio-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@ApiTags('portfolio-items')
@Controller('portfolio-items')
export class PortfolioItemsController {
    constructor(private readonly portfolioItemsService: PortfolioItemsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiConsumes('application/json')
    @ApiOperation({ summary: 'Create portfolio item (Admin) — URLs from POST /upload' })
    @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
    create(@Body() createDto: CreatePortfolioItemDto) {
        return this.portfolioItemsService.create(createDto);
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
    @ApiConsumes('application/json')
    @ApiOperation({ summary: 'Update portfolio item (Admin) — URLs from POST /upload' })
    @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
    update(@Param('id') id: string, @Body() updateDto: UpdatePortfolioItemDto) {
        return this.portfolioItemsService.update(id, updateDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete portfolio item (Admin)' })
    remove(@Param('id') id: string) {
        return this.portfolioItemsService.remove(id);
    }
}
