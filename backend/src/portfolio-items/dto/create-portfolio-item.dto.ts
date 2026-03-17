import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePortfolioItemDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    categoryId?: string;

    @IsOptional()
    @IsString()
    coverUrl?: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') return [];
        if (Array.isArray(value)) return value;
        return [value]; // single string from multipart → array
    })
    galleryUrls?: string[];

    @IsOptional()
    @IsString()
    videoUrl?: string;

    @IsOptional()
    @IsString() // Accept as string, service will handle date parsing
    eventDate?: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === true || value === 'true') return true;
        if (value === false || value === 'false') return false;
        return true; // default to true
    })
    isActive?: boolean;
}
