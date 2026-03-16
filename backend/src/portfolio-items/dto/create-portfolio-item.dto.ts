import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, IsUrl, IsDateString } from 'class-validator';

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
    @IsUrl({}, { each: true })
    @IsOptional()
    galleryUrls?: string[];

    @IsString()
    @IsOptional()
    @IsUrl()
    videoUrl?: string;

    @IsDateString()
    @IsOptional()
    eventDate?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
