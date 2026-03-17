import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

import { StorageService } from './storage.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly storageService: StorageService) { }

  @Post()
  @Post('single')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a file (Image or PDF)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
          return cb(new BadRequestException('Only image and PDF files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const publicUrl = await this.storageService.uploadFile(file, 'general');
    
    return {
      url: publicUrl,
      filename: file.originalname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }


  @Post('bulk')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: memoryStorage(),
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB per file
      },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|webp)$/)) {
          return cb(new BadRequestException('Only image, WebP and PDF files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files are required');
    }
    
    const results = [];
    for (const file of files) {
        const publicUrl = await this.storageService.uploadFile(file, 'bulk');
        results.push({
            url: publicUrl,
            filename: file.originalname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
        });
    }
    
    return results;
  }

  @Post('public')
  @ApiOperation({ summary: 'Upload a file (Public for Orders)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB for High Res Photos
      },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|tiff)$/)) {
          return cb(new BadRequestException('Only image and PDF files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFilePublic(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    
    const publicUrl = await this.storageService.uploadFile(file, 'public');
    
    return {
      url: publicUrl,
      filename: file.originalname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  @Post('transfer')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload large transfer file (1GB)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 1024 * 1024 * 1024, // 1GB
      },
      fileFilter: (req, file, cb) => {
        // Allow common archive and media types
        if (!file.originalname.match(/\.(zip|rar|7z|tar|gz|jpg|jpeg|png|mp4|mov|pdf)$/)) {
          return cb(new BadRequestException('Only archives and media files are allowed for transfer!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadTransferFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    
    const publicUrl = await this.storageService.uploadFile(file, 'transfer');
    
    return {
      url: publicUrl,
      filename: file.originalname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
