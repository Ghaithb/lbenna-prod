import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateQuoteDto } from './dto/create-quote.dto';

@ApiTags('quotes')
@Controller('quotes')
export class QuotesController {
    constructor(private readonly quotesService: QuotesService) { }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create quote (Admin)' })
    create(@Body() data: CreateQuoteDto) {
        return this.quotesService.create(data);
    }

    @Get()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all quotes (Admin)' })
    findAll() {
        return this.quotesService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get quote by ID (Admin)' })
    findOne(@Param('id') id: string) {
        return this.quotesService.findOne(id);
    }

    @Post(':id/accept')
    @ApiOperation({ summary: 'Accept quote (Public or Client)' })
    acceptQuote(@Param('id') id: string, @Body() body: { userId?: string }) {
        return this.quotesService.acceptQuote(id, body.userId);
    }

    @Post(':id/reject')
    @ApiOperation({ summary: 'Reject quote (Public or Client)' })
    rejectQuote(@Param('id') id: string, @Body() body: { reason?: string }) {
        return this.quotesService.rejectQuote(id, body.reason);
    }

    @Post(':id/send')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Send quote to client (Admin)' })
    sendQuote(@Param('id') id: string) {
        return this.quotesService.sendQuote(id);
    }

    @Get('number/:quoteNumber')
    @ApiOperation({ summary: 'Get quote by number' })
    findByNumber(@Param('quoteNumber') quoteNumber: string) {
        return this.quotesService.findByNumber(quoteNumber);
    }
}

