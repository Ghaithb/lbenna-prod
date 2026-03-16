import { Module } from '@nestjs/common';
import { PortfolioItemsService } from './portfolio-items.service';
import { PortfolioItemsController } from './portfolio-items.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UploadModule } from '../upload/upload.module';

@Module({
    imports: [UploadModule],
    controllers: [PortfolioItemsController],
    providers: [PortfolioItemsService, PrismaService],
})
export class PortfolioItemsModule { }
