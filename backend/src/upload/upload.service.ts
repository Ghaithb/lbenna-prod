import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createHash } from 'crypto';

@Injectable()
export class UploadService {
  private uploadDir: string;
  private maxFileSize: number;
  private allowedTypes: string[];

  constructor(private configService: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.maxFileSize = this.parseFileSize(
      this.configService.get<string>('MAX_FILE_SIZE', '50MB'),
    );
    this.allowedTypes = this.configService
      .get<string>('ALLOWED_FILE_TYPES', 'image/jpeg,image/png,image/tiff')
      .split(',');

    // Créer le dossier uploads s'il n'existe pas
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  private parseFileSize(size: string): number {
    const units = { B: 1, KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
    const match = size.match(/^(\d+)(B|KB|MB|GB)$/i);
    if (!match) return 50 * 1024 * 1024; // Default 50MB
    return parseInt(match[1]) * units[match[2].toUpperCase()];
  }

  async uploadFile(file: Express.Multer.File) {
    // Vérifier le type de fichier
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type not allowed. Allowed types: ${this.allowedTypes.join(', ')}`,
      );
    }

    // Vérifier la taille
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File too large. Max size: ${this.maxFileSize / (1024 * 1024)}MB`,
      );
    }

    // Générer un nom de fichier unique
    const hash = createHash('md5').update(file.buffer).digest('hex');
    const ext = path.extname(file.originalname);
    const filename = `${hash}${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    // Sauvegarder le fichier
    await fs.writeFile(filepath, file.buffer);

    // Analyser l'image
    const metadata = await this.analyzeImage(filepath);

    return {
      filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${filename}`,
      ...metadata,
    };
  }

  async uploadMultiple(files: Express.Multer.File[]) {
    return Promise.all(files.map(file => this.uploadFile(file)));
  }

  async analyzeImage(filepath: string) {
    try {
      const metadata = await sharp(filepath).metadata();

      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        dpi: metadata.density || 72,
        colorSpace: metadata.space,
        hasAlpha: metadata.hasAlpha,
      };
    } catch (error) {
      return null;
    }
  }

  async generateThumbnail(
    filepath: string,
    width: number = 300,
    height: number = 300,
  ) {
    const ext = path.extname(filepath);
    const basename = path.basename(filepath, ext);
    const thumbnailPath = path.join(
      this.uploadDir,
      `${basename}_thumb_${width}x${height}${ext}`,
    );

    await sharp(filepath)
      .resize(width, height, {
        fit: 'cover',
        position: 'center',
      })
      .toFile(thumbnailPath);

    return {
      url: `/uploads/${path.basename(thumbnailPath)}`,
      width,
      height,
    };
  }

  async validateImageQuality(filepath: string, minDPI: number = 300) {
    const metadata = await sharp(filepath).metadata();

    const dpi = metadata.density || 72;
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    const warnings = [];
    const errors = [];

    // Vérifier le DPI
    if (dpi < minDPI) {
      warnings.push(
        `Low DPI: ${dpi}. Recommended: ${minDPI}+ for print quality`,
      );
    }

    // Vérifier la résolution minimale
    if (width < 1000 || height < 1000) {
      errors.push(
        `Image resolution too low: ${width}x${height}. Minimum: 1000x1000`,
      );
    }

    // Vérifier le mode couleur
    if (metadata.space && !['srgb', 'rgb'].includes(metadata.space)) {
      warnings.push(
        `Color space is ${metadata.space}. sRGB or RGB recommended`,
      );
    }

    return {
      valid: errors.length === 0,
      warnings,
      errors,
      metadata: {
        width,
        height,
        dpi,
        colorSpace: metadata.space,
        format: metadata.format,
      },
    };
  }

  async convertToFormat(
    filepath: string,
    format: 'jpeg' | 'png' | 'tiff' | 'webp',
    quality: number = 90,
  ) {
    const ext = path.extname(filepath);
    const basename = path.basename(filepath, ext);
    const outputPath = path.join(this.uploadDir, `${basename}.${format}`);

    await sharp(filepath)
      .toFormat(format, { quality })
      .toFile(outputPath);

    return {
      url: `/uploads/${path.basename(outputPath)}`,
      format,
    };
  }

  async deleteFile(filename: string) {
    const filepath = path.join(this.uploadDir, filename);

    try {
      await fs.unlink(filepath);
      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new BadRequestException('File not found');
    }
  }

  async getFileInfo(filename: string) {
    const filepath = path.join(this.uploadDir, filename);

    try {
      const stats = await fs.stat(filepath);
      const metadata = await this.analyzeImage(filepath);

      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        url: `/uploads/${filename}`,
        ...metadata,
      };
    } catch (error) {
      throw new BadRequestException('File not found');
    }
  }
}
