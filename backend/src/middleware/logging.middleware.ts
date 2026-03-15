import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const duration = Date.now() - start;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} - ${duration}ms`,
      );

      // Log sensitive operations
      if (this.isSensitiveOperation(method, originalUrl)) {
        this.logger.warn(
          `Sensitive operation: ${method} ${originalUrl} by IP ${ip}`,
        );
      }
    });

    next();
  }

  private isSensitiveOperation(method: string, url: string): boolean {
    const sensitivePatterns = [
      '/api/auth/',
      '/api/admin/',
      '/api/users/',
      '/api/license/',
    ];
    return sensitivePatterns.some((pattern) => url.includes(pattern));
  }
}