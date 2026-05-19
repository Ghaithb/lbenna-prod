import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { StorageService } from './storage.service';
import { ImageOptimizationService } from './image-optimization.service';

@Module({
  controllers: [UploadController],
  providers: [StorageService, ImageOptimizationService],
  exports: [StorageService, ImageOptimizationService],
})
export class UploadModule { }

