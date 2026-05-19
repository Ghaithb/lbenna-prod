import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import cors from 'cors';
import * as path from 'path';
import { applyCorsHeaders, corsOptions } from '../src/config/cors';

let cachedApp: express.Express;

async function bootstrap() {
  if (cachedApp) {
    return cachedApp;
  }
  const expressApp = express();
  expressApp.set('trust proxy', 1);
  expressApp.use(cors(corsOptions));
  expressApp.options('*', cors(corsOptions));

  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter, {
    logger: ['error', 'warn', 'log'],
  });

  app.enableCors(corsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  app.setGlobalPrefix('api');

  app.use(
    '/assets',
    express.static(path.join(__dirname, '../backend/assets')),
  );

  await app.init();
  cachedApp = expressApp;
  return cachedApp;
}

export default async function handler(req: express.Request, res: express.Response) {
  applyCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const app = await bootstrap();
    return app(req, res);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('[API HANDLER ERROR]', err.message, err.stack);

    applyCorsHeaders(req, res);

    const missingDb = !process.env.DATABASE_URL;
    res.status(500).json({
      message: missingDb
        ? 'Server misconfigured: DATABASE_URL is not set on Vercel'
        : 'Server failed to start',
      hint: missingDb
        ? 'Vercel → backend → Environment Variables → add DATABASE_URL (Supabase pooler, port 6543)'
        : 'Run npm run db:migrate with Supabase DIRECT_URL, then redeploy. Check DATABASE_URL format (?pgbouncer=true).',
      detail: process.env.VERCEL_ENV !== 'production' ? err.message : undefined,
    });
  }
}
