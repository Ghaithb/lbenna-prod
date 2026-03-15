import { Module } from '@nestjs/common';
import { PortfolioItemsService } from './portfolio-items.service';
import { PortfolioItemsController } from './portfolio-items.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [PortfolioItemsController],
    providers: [PortfolioItemsService, PrismaService],
})
export class PortfolioItemsModule { }
