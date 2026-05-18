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
  if (!cachedApp) {
    const expressApp = express();
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
  }
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
    console.error('[API HANDLER ERROR]', error);
    applyCorsHeaders(req, res);
    res.status(500).json({ message: 'Internal server error' });
  }
}
