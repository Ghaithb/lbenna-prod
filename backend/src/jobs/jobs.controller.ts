import { Controller, Get, Post, Put, Body, Param, Query, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JobStatus } from '@prisma/client';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all jobs' })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: JobStatus,
  ) {
    return this.jobsService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 20,
      status,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get job statistics' })
  async getStats() {
    return this.jobsService.getJobStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by ID' })
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Put(':id/retry')
  @ApiOperation({ summary: 'Retry failed job' })
  async retryJob(@Param('id') id: string) {
    return this.jobsService.retryJob(id);
  }

  @Delete('cleanup')
  @ApiOperation({ summary: 'Cleanup old completed jobs' })
  async cleanupOldJobs(@Query('daysOld') daysOld?: string) {
    return this.jobsService.cleanupOldJobs(
      daysOld ? parseInt(daysOld) : 30,
    );
  }

  @Post('email')
  @ApiOperation({ summary: 'Queue email job' })
  async sendEmail(
    @Body() body: {
      to: string;
      subject: string;
      template: string;
      data: any;
    },
  ) {
    return this.jobsService.sendEmail(
      body.to,
      body.subject,
      body.template,
      body.data,
    );
  }

  @Post('sms')
  @ApiOperation({ summary: 'Queue SMS job' })
  async sendSMS(@Body() body: { to: string; message: string }) {
    return this.jobsService.sendSMS(body.to, body.message);
  }

  @Post('thumbnail')
  @ApiOperation({ summary: 'Queue thumbnail generation job' })
  async generateThumbnail(
    @Body() body: {
      fileUrl: string;
      size: { width: number; height: number };
    },
  ) {
    return this.jobsService.generateThumbnail(body.fileUrl, body.size);
  }
}
