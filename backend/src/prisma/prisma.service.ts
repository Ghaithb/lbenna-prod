import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private connected = false;

  async onModuleInit() {
    if (!process.env.DATABASE_URL) {
      this.logger.error(
        'DATABASE_URL is not set. Add it in Vercel → Project Settings → Environment Variables.',
      );
      if (!process.env.VERCEL) {
        throw new Error('DATABASE_URL is required');
      }
      return;
    }

    try {
      await this.$connect();
      this.connected = true;
      this.logger.log('Database connected');
    } catch (error) {
      this.logger.error('Database connection failed', error);
      // On Vercel/serverless: allow API to boot (health checks); routes return errors until DB is fixed
      if (!process.env.VERCEL) {
        throw error;
      }
    }
  }

  async onModuleDestroy() {
    if (this.connected) {
      await this.$disconnect();
    }
  }

  ensureConnected() {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        'Database not configured. Set DATABASE_URL on Vercel (Supabase/Postgres connection string).',
      );
    }
    if (!this.connected && process.env.VERCEL) {
      throw new Error(
        'Database unreachable. Check DATABASE_URL, Supabase project status, and network access.',
      );
    }
  }
}
