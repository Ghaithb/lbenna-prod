import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBookingDto {
    @IsString()
    @IsNotEmpty()
    serviceOfferId: string;

    @IsOptional()
    @IsString()
    userId?: string;

    @IsDateString()
    @IsNotEmpty()
    bookingDate: string; // ISO 8601 Date String

    @IsString()
    @IsNotEmpty()
    customerName: string;

    @IsString()
    @IsNotEmpty()
    customerEmail: string;

    @IsString()
    @IsNotEmpty()
    customerPhone: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsString()
    eventType?: string;

    @IsOptional()
    @IsString()
    duration?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    budget?: string;

    @IsOptional()
    @IsString()
    guests?: string;

    @IsOptional()
    @IsString()
    companyName?: string;

    @IsOptional()
    dynamicDetails?: any;
}
