import { Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';
// Note: file-type is ESM-only in v21+, use dynamic import for Jest/TS compatibility

@Injectable()
export class FileValidationService {
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
  private readonly ALLOWED_DOCUMENT_TYPES = ['application/pdf'];

  async validateFile(file: Express.Multer.File, type: 'image' | 'video' | 'document' = 'image') {
    // Vérifier la taille du fichier
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(`File size exceeds ${this.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Vérifier le type MIME réel du fichier
    const FileType = await import('file-type');
    const fileTypeResult = await FileType.fromBuffer(file.buffer);
    if (!fileTypeResult) {
      throw new BadRequestException('Could not determine file type');
    }

    const mimeType = fileTypeResult.mime;

    // Valider selon le type demandé
    switch (type) {
      case 'image':
        if (!this.ALLOWED_IMAGE_TYPES.includes(mimeType)) {
          throw new BadRequestException('Invalid image type. Allowed types: ' + this.ALLOWED_IMAGE_TYPES.join(', '));
        }
        break;
      case 'video':
        if (!this.ALLOWED_VIDEO_TYPES.includes(mimeType)) {
          throw new BadRequestException('Invalid video type. Allowed types: ' + this.ALLOWED_VIDEO_TYPES.join(', '));
        }
        break;
      case 'document':
        if (!this.ALLOWED_DOCUMENT_TYPES.includes(mimeType)) {
          throw new BadRequestException('Invalid document type. Allowed types: ' + this.ALLOWED_DOCUMENT_TYPES.join(', '));
        }
        break;
    }

    // Valider l'extension
    const extension = extname(file.originalname).toLowerCase();
    const allowedExtensions = this.getAllowedExtensions(type);
    if (!allowedExtensions.includes(extension)) {
      throw new BadRequestException(`Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`);
    }

    return true;
  }

  private getAllowedExtensions(type: 'image' | 'video' | 'document'): string[] {
    switch (type) {
      case 'image':
        return ['.jpg', '.jpeg', '.png', '.webp'];
      case 'video':
        return ['.mp4', '.webm'];
      case 'document':
        return ['.pdf'];
      default:
        return [];
    }
  }

  async validateImageDimensions(buffer: Buffer, minWidth = 0, minHeight = 0, maxWidth = 8000, maxHeight = 8000) {
    const sharp = require('sharp');
    const metadata = await sharp(buffer).metadata();

    if (metadata.width < minWidth || metadata.height < minHeight) {
      throw new BadRequestException(`Image dimensions too small. Minimum: ${minWidth}x${minHeight}`);
    }

    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      throw new BadRequestException(`Image dimensions too large. Maximum: ${maxWidth}x${maxHeight}`);
    }

    return true;
  }
}