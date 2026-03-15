import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { JobType, JobStatus } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('default') private queue: Queue,
  ) { }

  async createJob(type: JobType, payload: any) {
    const job = await this.prisma.job.create({
      data: {
        type,
        payload,
        status: JobStatus.PENDING,
      },
    });

    // Ajouter à la queue Bull
    await this.queue.add(type, {
      jobId: job.id,
      payload,
    });

    return job;
  }

  async findAll(skip = 0, take = 20, status?: JobStatus) {
    const where = status ? { status } : {};

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      data: jobs,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async findOne(id: string) {
    return this.prisma.job.findUnique({
      where: { id },
    });
  }

  async updateStatus(
    id: string,
    status: JobStatus,
    result?: any,
  ) {
    const data: any = { status };

    if (status === JobStatus.PROCESSING) {
      data.startedAt = new Date();
    }

    if (status === JobStatus.COMPLETED || status === JobStatus.FAILED) {
      data.completedAt = new Date();
      if (result) {
        data.result = result;
      }
    }

    return this.prisma.job.update({
      where: { id },
      data,
    });
  }

  async incrementAttempts(id: string) {
    const job = await this.findOne(id);

    return this.prisma.job.update({
      where: { id },
      data: {
        attempts: (job.attempts || 0) + 1,
      },
    });
  }

  async retryJob(id: string) {
    const job = await this.findOne(id);

    if (job.attempts >= job.maxAttempts) {
      throw new Error('Max attempts reached');
    }

    await this.incrementAttempts(id);
    await this.updateStatus(id, JobStatus.PENDING);

    // Réajouter à la queue
    await this.queue.add(job.type, {
      jobId: job.id,
      payload: job.payload,
    });

    return job;
  }

  async getJobStats() {
    const [total, pending, processing, completed, failed] = await Promise.all([
      this.prisma.job.count(),
      this.prisma.job.count({ where: { status: JobStatus.PENDING } }),
      this.prisma.job.count({ where: { status: JobStatus.PROCESSING } }),
      this.prisma.job.count({ where: { status: JobStatus.COMPLETED } }),
      this.prisma.job.count({ where: { status: JobStatus.FAILED } }),
    ]);

    return {
      total,
      pending,
      processing,
      completed,
      failed,
    };
  }

  async cleanupOldJobs(daysOld: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const deleted = await this.prisma.job.deleteMany({
      where: {
        status: {
          in: [JobStatus.COMPLETED, JobStatus.FAILED],
        },
        completedAt: {
          lt: cutoffDate,
        },
      },
    });

    return {
      deleted: deleted.count,
    };
  }

  // Méthodes spécifiques pour différents types de jobs

  async transformImage(fileUrl: string, transformations: any) {
    return this.createJob(JobType.IMAGE_TRANSFORM, {
      fileUrl,
      transformations,
    });
  }

  async sendEmail(to: string, subject: string, template: string, data: any) {
    return this.createJob(JobType.SEND_EMAIL, {
      to,
      subject,
      template,
      data,
    });
  }

  async sendSMS(to: string, message: string) {
    return this.createJob(JobType.SEND_SMS, {
      to,
      message,
    });
  }

  async generateThumbnail(fileUrl: string, size: { width: number; height: number }) {
    return this.createJob(JobType.GENERATE_THUMBNAIL, {
      fileUrl,
      size,
    });
  }
}
