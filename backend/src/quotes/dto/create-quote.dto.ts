import { IsString, IsOptional, IsNumber, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuoteDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    userId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    clientName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    clientEmail?: string;

    @ApiProperty({ example: [] })
    @IsArray()
    items: any[];

    @ApiProperty({ example: 0 })
    @IsNumber()
    subtotal: number;

    @ApiProperty({ example: 0 })
    @IsNumber()
    taxAmount: number;

    @ApiProperty({ example: 0 })
    @IsNumber()
    total: number;

    @ApiProperty({ required: false })
    @IsOptional()
    validUntil?: Date;
}
