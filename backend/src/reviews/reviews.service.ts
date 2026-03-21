import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    return this.prisma.review.create({
      data: createReviewDto,
    });
  }

  async findAll(onlyActive = true) {
    return this.prisma.review.findMany({
      where: onlyActive ? { isActive: true } : {},
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.review.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  async remove(id: string) {
    return this.prisma.review.delete({
      where: { id },
    });
  }
}
