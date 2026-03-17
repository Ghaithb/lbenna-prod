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
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL')?.trim();
        const supabaseKey = this.configService.get<string>('SUPABASE_KEY')?.trim();
        this.bucket = this.configService.get<string>('SUPABASE_BUCKET')?.trim() || 'portfolio';

        this.logger.log(`Initializing StorageService with bucket: ${this.bucket}`);
        if (!supabaseUrl) this.logger.error('SUPABASE_URL is missing!');
        if (!supabaseKey) this.logger.error('SUPABASE_KEY is missing!');
        
        if (supabaseKey) {
            this.logger.log(`SUPABASE_KEY starts with: ${supabaseKey.substring(0, 10)}... (Type: ${supabaseKey.startsWith('sb_publishable') ? 'PUBLIC' : 'SECRET/SERVICE_ROLE'})`);
        }

        this.supabase = createClient(supabaseUrl || '', supabaseKey || '');
    }

    /**
     * Upload a file buffer directly to Supabase Storage
     */
    async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
        if (!file || !file.buffer) {
            throw new Error('File buffer is empty or missing');
        }

        try {
            const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
            const filename = `${folder}/${Date.now()}-${randomName}${extname(file.originalname)}`;

            this.logger.log(`Attempting upload to Supabase: ${filename} (${file.size} bytes)`);

            const { data, error } = await this.supabase.storage
                .from(this.bucket)
                .upload(filename, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (error) {
                const errorDetail = `Supabase Upload Error: [${error.name}] ${error.message} (Bucket: ${this.bucket}, Filename: ${filename})`;
                this.logger.error(errorDetail);
                throw new Error(errorDetail);
            }

            // Get public URL
            const { data: publicUrlData } = this.supabase.storage
                .from(this.bucket)
                .getPublicUrl(filename);

            if (!publicUrlData || !publicUrlData.publicUrl) {
                throw new Error(`Failed to generate public URL for ${filename}`);
            }

            return publicUrlData.publicUrl;
        } catch (error) {
            this.logger.error(`Upload error: ${error.message}`);
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
