import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { extname } from 'path';

@Injectable()
export class StorageService {
    private supabase: SupabaseClient;
    private bucket: string;
    private readonly logger = new Logger(StorageService.name);

    constructor(private configService: ConfigService) {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
        this.bucket = this.configService.get<string>('SUPABASE_BUCKET') || 'portfolio';

        if (!supabaseUrl || !supabaseKey) {
            this.logger.warn('Supabase URL or Key not found in environment variables. Uploads will fail.');
        }

        this.supabase = createClient(supabaseUrl || '', supabaseKey || '');
    }

    /**
     * Upload a file buffer directly to Supabase Storage
     */
    async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
        try {
            const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
            const filename = `${folder}/${Date.now()}-${randomName}${extname(file.originalname)}`;

            const { data, error } = await this.supabase.storage
                .from(this.bucket)
                .upload(filename, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (error) {
                this.logger.error(`Supabase Upload Error: [${error.name}] ${error.message} (Bucket: ${this.bucket}, Filename: ${filename})`);
                throw new Error(`Failed to upload to Supabase: ${error.message}`);
            }

            // Get public URL
            const { data: publicUrlData } = this.supabase.storage
                .from(this.bucket)
                .getPublicUrl(filename);

            return publicUrlData.publicUrl;
        } catch (error) {
            this.logger.error(`Upload error: ${error}`);
            throw error;
        }
    }

    /**
     * Legacy method for S3 pre-signed URLs (kept for backward compatibility if needed, 
     * but adapted to return Supabase format or throw error)
     */
    async getPresignedUploadUrl(filename: string, contentType: string): Promise<{ url: string; key: string; publicUrl: string }> {
        throw new Error("Pre-signed URLs are not implemented for the Supabase integration yet. Use direct upload endpoint.");
    }
}
