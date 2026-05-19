import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import { extname } from 'path';

export interface OptimizedImage {
  buffer: Buffer;
  mimetype: string;
  extension: string;
  originalBytes: number;
  optimizedBytes: number;
  wasOptimized: boolean;
}

const RASTER_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/tiff',
]);

@Injectable()
export class ImageOptimizationService {
  private readonly logger = new Logger(ImageOptimizationService.name);
  private readonly enabled: boolean;
  private readonly maxWidth: number;
  private readonly maxHeight: number;
  private readonly jpegQuality: number;
  private readonly webpQuality: number;
  private readonly pngCompression: number;
  private readonly minBytesToOptimize: number;

  constructor(private readonly config: ConfigService) {
    this.enabled = this.config.get<string>('IMAGE_OPTIMIZE', 'true') !== 'false';
    this.maxWidth = Number(this.config.get<string>('IMAGE_MAX_WIDTH', '1920'));
    this.maxHeight = Number(this.config.get<string>('IMAGE_MAX_HEIGHT', '1920'));
    this.jpegQuality = Number(this.config.get<string>('IMAGE_JPEG_QUALITY', '82'));
    this.webpQuality = Number(this.config.get<string>('IMAGE_WEBP_QUALITY', '82'));
    this.pngCompression = Number(this.config.get<string>('IMAGE_PNG_COMPRESSION', '9'));
    this.minBytesToOptimize = Number(this.config.get<string>('IMAGE_MIN_BYTES', '150000'));
  }

  private wrapOriginal(file: Express.Multer.File): OptimizedImage {
    return {
      buffer: file.buffer,
      mimetype: file.mimetype,
      extension: extname(file.originalname).toLowerCase() || '.jpg',
      originalBytes: file.buffer.length,
      optimizedBytes: file.buffer.length,
      wasOptimized: false,
    };
  }

  isRasterImage(mimetype: string | undefined): boolean {
    return RASTER_IMAGE_TYPES.has((mimetype || '').toLowerCase());
  }

  /**
   * Resize (max 1920px) + compress for web. Keeps PNG when transparency is needed.
   * JPEG quality ~82 is visually near-lossless for photos while cutting file size heavily.
   */
  async optimize(file: Express.Multer.File): Promise<OptimizedImage> {
    if (!file?.buffer?.length) {
      throw new Error('Empty file buffer');
    }

    const mime = (file.mimetype || '').toLowerCase();
    if (!this.enabled || !this.isRasterImage(mime) || mime === 'image/gif') {
      return this.wrapOriginal(file);
    }

    if (file.buffer.length < this.minBytesToOptimize) {
      return this.wrapOriginal(file);
    }

    try {
      const input = sharp(file.buffer, { failOn: 'none' }).rotate();
      const meta = await input.metadata();

      let pipeline = input;
      const w = meta.width || 0;
      const h = meta.height || 0;
      if (w > this.maxWidth || h > this.maxHeight) {
        pipeline = pipeline.resize({
          width: this.maxWidth,
          height: this.maxHeight,
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      let buffer: Buffer;
      let mimetype: string;
      let extension: string;

      const hasAlpha = meta.hasAlpha === true;

      if (mime === 'image/png' && hasAlpha) {
        buffer = await pipeline
          .png({ compressionLevel: this.pngCompression, adaptiveFiltering: true })
          .toBuffer();
        mimetype = 'image/png';
        extension = '.png';
      } else if (mime === 'image/webp') {
        buffer = await pipeline.webp({ quality: this.webpQuality, effort: 4 }).toBuffer();
        mimetype = 'image/webp';
        extension = '.webp';
      } else {
        buffer = await pipeline
          .jpeg({ quality: this.jpegQuality, mozjpeg: true, chromaSubsampling: '4:4:4' })
          .toBuffer();
        mimetype = 'image/jpeg';
        extension = '.jpg';
      }

      if (buffer.length >= file.buffer.length * 0.97) {
        return this.wrapOriginal(file);
      }

      const savedPct = Math.round((1 - buffer.length / file.buffer.length) * 100);
      this.logger.log(
        `Image optimized: ${(file.buffer.length / 1024).toFixed(0)}KB → ${(buffer.length / 1024).toFixed(0)}KB (-${savedPct}%) ${file.originalname}`,
      );

      return {
        buffer,
        mimetype,
        extension,
        originalBytes: file.buffer.length,
        optimizedBytes: buffer.length,
        wasOptimized: true,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Image optimization skipped for ${file.originalname}: ${msg}`);
      return this.wrapOriginal(file);
    }
  }
}
