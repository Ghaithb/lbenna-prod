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
        
        if (supabaseKey && process.env.NODE_ENV !== 'production') {
            const keyType = supabaseKey.startsWith('sb_publishable') ? 'PUBLIC' : 'SERVICE_ROLE';
            this.logger.log(`SUPABASE_KEY configured (${keyType})`);
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

        const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
        const filename = `${folder}/${Date.now()}-${randomName}${extname(file.originalname)}`;

        try {
            this.logger.log(`Attempting upload to Supabase: ${filename} (${file.size} bytes)`);

            const { data, error } = await this.supabase.storage
                .from(this.bucket)
                .upload(filename, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (error) {
                throw new Error(error.message);
            }

            const { data: publicUrlData } = this.supabase.storage
                .from(this.bucket)
                .getPublicUrl(filename);

            if (!publicUrlData || !publicUrlData.publicUrl) {
                throw new Error(`No public URL returned`);
            }

            return publicUrlData.publicUrl;
        } catch (error) {
            this.logger.warn(`Supabase Upload failed (${error.message}). Falling back to local storage.`);
            try {
                // Fallback to local storage
                const fs = require('fs');
                const path = require('path');
                const uploadDir = path.join(process.cwd(), 'uploads', folder);
                
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                
                const localFilename = `${Date.now()}-${randomName}${extname(file.originalname)}`;
                const localPath = path.join(uploadDir, localFilename);
                
                fs.writeFileSync(localPath, file.buffer);
                this.logger.log(`Saved file locally to ${localPath}`);
                
                return `/uploads/${folder}/${localFilename}`;
            } catch (localError) {
                this.logger.error(`Local upload fallback also failed: ${localError.message}`);
                throw new Error(`Both Supabase and Local Uploads failed.`);
            }
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
