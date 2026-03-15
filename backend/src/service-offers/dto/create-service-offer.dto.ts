import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateServiceOfferDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsNumber()
    duration?: number; // Minutes

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    categoryId?: string;

    @IsOptional()
    @IsString({ each: true })
    features?: string[];

    @IsOptional()
    @IsString()
    badge?: string;

    @IsOptional()
    @IsBoolean()
    isPromo?: boolean;

    @IsOptional()
    @IsNumber()
    promoPrice?: number;

    @IsOptional()
    @IsString() // Should be ISO date string
    promoExpiresAt?: string; // Expecting string from frontend

    @IsOptional()
    @IsBoolean()
    isPack?: boolean;
}

