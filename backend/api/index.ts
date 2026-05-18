import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from '../src/app.module'; // Import root module
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import * as path from 'path';
import { corsOptions } from '../src/config/cors';

// Store the initialized app instance (warm start for Serverless Functions)
let cachedApp: any;

async function bootstrap() {
    if (!cachedApp) {
        const expressApp = express();
        const adapter = new ExpressAdapter(expressApp);

        // Basic rate limit and security handled by Vercel Edge Networks already, 
        // no need to re-implement Helmet/RateLimit fully here if it causes overhead, 
        // but we'll keep CORS validation.

        const app = await NestFactory.create(AppModule, adapter, {
            logger: ['error', 'warn', 'log'], // Reduce logs in prod
        });

        app.enableCors(corsOptions);

        // Validation pipes
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                exceptionFactory: (errors) => {
                    return new BadRequestException(errors);
                },
            }),
        );

        // Set global prefix exactly like main.ts
        app.setGlobalPrefix('api');

        // Allow serving static 3D assets via Express 
        // Vercel handles static assets differently but this provides a fallback
        app.use('/assets', express.static(path.join(__dirname, '../backend/assets')));

        await app.init();
        cachedApp = expressApp; // Cache the express instance
    }
    return cachedApp;
}

// Export the Vercel handler for standard serverless execution
export default async function handler(req: any, res: any) {
    const app = await bootstrap();
    return app(req, res); // Forward the native Request/Response to Express/NestJS
}
