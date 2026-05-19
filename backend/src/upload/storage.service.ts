import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService implements OnModuleInit {
  private supabase: SupabaseClient;
  private bucket: string;
  private bucketReady = false;
  private readonly logger = new Logger(StorageService.name);
  private readonly isServerless = Boolean(process.env.VERCEL);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL')?.trim();
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY')?.trim();
    this.bucket =
      this.configService.get<string>('SUPABASE_BUCKET')?.trim() || 'portfolio';

    this.logger.log(`StorageService bucket="${this.bucket}" serverless=${this.isServerless}`);

    if (!supabaseUrl) {
      this.logger.error('SUPABASE_URL is missing on Vercel → link Supabase integration or set env var');
    }
    if (!supabaseKey) {
      this.logger.error('SUPABASE_KEY is missing → use service_role key, not anon');
    }

    this.supabase = createClient(supabaseUrl || '', supabaseKey || '');
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.ensureBucketExists();
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Storage bucket check failed: ${msg}`);
    }
  }

  /** Create public bucket if missing (requires service_role key). */
  private async ensureBucketExists(): Promise<void> {
    const url = this.configService.get<string>('SUPABASE_URL')?.trim();
    const key = this.configService.get<string>('SUPABASE_KEY')?.trim();
    if (!url || !key) {
      return;
    }

    const { data: buckets, error: listError } = await this.supabase.storage.listBuckets();
    if (listError) {
      throw new Error(`listBuckets: ${listError.message}`);
    }

    const exists = buckets?.some((b) => b.name === this.bucket);
    if (exists) {
      this.bucketReady = true;
      this.logger.log(`Supabase bucket "${this.bucket}" is ready`);
      return;
    }

    this.logger.warn(`Bucket "${this.bucket}" not found — creating (public)`);
    const { error: createError } = await this.supabase.storage.createBucket(this.bucket, {
      public: true,
      fileSizeLimit: 52_428_800, // 50 MB
    });

    if (createError) {
      const alreadyExists =
        createError.message.toLowerCase().includes('already exists') ||
        createError.message.toLowerCase().includes('duplicate');
      if (!alreadyExists) {
        throw new Error(
          `createBucket("${this.bucket}"): ${createError.message}. ` +
            `Create it manually in Supabase → Storage → New bucket → name "${this.bucket}" → Public.`,
        );
      }
    }

    this.bucketReady = true;
    this.logger.log(`Supabase bucket "${this.bucket}" created or already present`);
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('File buffer is empty or missing');
    }

    if (!this.configService.get<string>('SUPABASE_URL')?.trim()) {
      throw new InternalServerErrorException(
        'SUPABASE_URL is not configured on the server. Add it in Vercel → backend → Environment Variables.',
      );
    }
    if (!this.configService.get<string>('SUPABASE_KEY')?.trim()) {
      throw new InternalServerErrorException(
        'SUPABASE_KEY (service_role) is not configured on the server.',
      );
    }

    if (!this.bucketReady) {
      await this.ensureBucketExists();
    }

    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    const filename = `${folder}/${Date.now()}-${randomName}${extname(file.originalname)}`;

    this.logger.log(`Uploading to Supabase ${this.bucket}/${filename} (${file.size} bytes)`);

    const { error } = await this.supabase.storage.from(this.bucket).upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

    if (error) {
      const hint = error.message.toLowerCase().includes('bucket not found')
        ? ` Create a public bucket named "${this.bucket}" in Supabase → Storage, or set SUPABASE_BUCKET on Vercel.`
        : '';
      this.logger.error(`Supabase upload failed: ${error.message}${hint}`);

      if (this.isServerless) {
        throw new InternalServerErrorException(
          `Upload Supabase échoué: ${error.message}.${hint}`,
        );
      }

      return this.saveLocalFallback(file, folder, randomName);
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(filename);

    if (!publicUrlData?.publicUrl) {
      throw new InternalServerErrorException('Supabase did not return a public URL');
    }

    return publicUrlData.publicUrl;
  }

  private saveLocalFallback(
    file: Express.Multer.File,
    folder: string,
    randomName: string,
  ): string {
    const baseDir = this.isServerless
      ? path.join('/tmp', 'uploads', folder)
      : path.join(process.cwd(), 'uploads', folder);

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    const localFilename = `${Date.now()}-${randomName}${extname(file.originalname)}`;
    const localPath = path.join(baseDir, localFilename);
    fs.writeFileSync(localPath, file.buffer);
    this.logger.log(`Saved locally: ${localPath}`);
    return `/uploads/${folder}/${localFilename}`;
  }

  async getPresignedUploadUrl(): Promise<{ url: string; key: string; publicUrl: string }> {
    throw new Error(
      'Pre-signed URLs are not implemented for Supabase. Use POST /api/upload instead.',
    );
  }
}
