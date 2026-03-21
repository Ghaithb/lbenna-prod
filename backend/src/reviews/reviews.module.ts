import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [PrismaModule],
  exports: [ReviewsService],
})
export class ReviewsModule {}
