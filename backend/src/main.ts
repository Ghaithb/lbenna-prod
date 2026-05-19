import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import * as path from 'path';
import * as express from 'express';
import { corsOptions } from './config/cors';
import { ensureDatabaseEnv } from './config/database-env';

ensureDatabaseEnv();

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Enable trust proxy for Vercel/proxies (Required for express-rate-limit)
    (app as any).set('trust proxy', 1);

    // Basic rate limiting for security
    app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 2000 }));

    // Security Headers
    app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow serving static files (images)
    }));

    app.enableCors(corsOptions);

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => {
          console.error('[VALIDATION ERROR]', JSON.stringify(errors, null, 2));
          return new BadRequestException(errors);
        },
      }),
    );

    // Global prefix
    app.setGlobalPrefix('api');

    // Swagger — development only (not exposed on production serverless)
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      const config = new DocumentBuilder()
        .setTitle('L Benna Production API')
        .setDescription('API plateforme L Benna Production')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api/docs', app, document);
    }

    const port = process.env.PORT || 3001;
    // Serve static uploads directory (read-only)
    const root = process.cwd(); // Pointe vers la racine du processus (dossier backend)
    // Serve static assets (HDRIs, models, textures)
    app.use('/assets', express.static(path.join(root, 'backend/assets')));
    app.use('/uploads', express.static(path.join(root, 'uploads')));

    await app.listen(port);

  } catch (error) {
    const fs = require('fs');
    const path = require('path');
    const crashLog = `ERROR: ${error.message}\nSTACK: ${error.stack}\n`;
    fs.writeFileSync(path.join(process.cwd(), 'crash_report.txt'), crashLog);

    console.error('❌ FATAL ERROR DURING BOOTSTRAP:');
    console.error(error);
    if (error.stack) {
      console.error('STACK TRACE:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

bootstrap();
