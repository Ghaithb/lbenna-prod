import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePortfolioItemDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    categoryId?: string;

    @IsString()
    @IsOptional()
    coverUrl?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        return [value];
    })
    galleryUrls?: string[];

    @IsString()
    @IsOptional()
    videoUrl?: string;

    @IsDateString()
    @IsOptional()
    eventDate?: string;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return value;
    })
    isActive?: boolean;
}
