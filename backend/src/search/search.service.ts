import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchOptions, PaginatedResponse } from '../common/interfaces/search.interface';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) { }

  async searchUsers(options: SearchOptions): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10, search = '', filters = {}, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { email: { contains: search, mode: "insensitive" as const } },
        { firstName: { contains: search, mode: "insensitive" as const } },
        { lastName: { contains: search, mode: "insensitive" as const } },
      ],
      ...filters,
    };

    const [total, data] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      lastPage,
      hasMore: page < lastPage,
    };
  }

  async searchProjects(options: SearchOptions): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10, search = '', filters = {}, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { summary: { contains: search, mode: "insensitive" as const } },
      ],
      ...filters,
    };

    const [total, data] = await Promise.all([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
    ]);

    const lastPage = Math.ceil(total / limit);

    return { data, total, page, lastPage, hasMore: page < lastPage };
  }

  async searchServiceOffers(options: SearchOptions): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10, search = '', filters = {}, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
      ...filters,
    };

    const [total, data] = await Promise.all([
      this.prisma.serviceOffer.count({ where }),
      this.prisma.serviceOffer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { category: true },
      }),
    ]);

    const lastPage = Math.ceil(total / limit);

    return { data, total, page, lastPage, hasMore: page < lastPage };
  }
}