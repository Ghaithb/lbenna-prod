import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  // Use the concrete PrismaService type so Nest can resolve the provider correctly.
  // After running `npx prisma generate` the Prisma client will be available.
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 20) {
    const client: any = this.prisma;
    const [data, total] = await Promise.all([
      client.project.findMany({
        skip,
        take,
        orderBy: [{ createdAt: 'desc' }],
      }),
      client.project.count(),
    ]);

    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }

  async findOne(id: string) {
  const client: any = this.prisma;
  const p = await client.project.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Project not found');
    return p;
  }

  async findBySlug(slug: string) {
  const client: any = this.prisma;
  const p = await client.project.findUnique({ where: { slug } });
    if (!p) throw new NotFoundException('Project not found');
    return p;
  }

  async create(data: {
    slug: string;
    title: string;
    summary?: string;
    content?: any;
    imageUrl?: string;
    tags?: string[];
    published?: boolean;
    authorId?: string;
  }) {
  const client: any = this.prisma;
  return client.project.create({ data });
  }

  async update(id: string, data: Partial<{
    slug: string;
    title: string;
    summary?: string;
    content?: any;
    imageUrl?: string;
    tags?: string[];
    published?: boolean;
  }>) {
  const client: any = this.prisma;
  return client.project.update({ where: { id }, data });
  }

  async delete(id: string) {
  const client: any = this.prisma;
  await client.project.delete({ where: { id } });
    return { message: 'Project deleted' };
  }
}
