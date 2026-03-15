import { IsString, IsOptional, IsBoolean, IsNumber, IsJSON } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePageDto {
    @ApiProperty({ example: 'À Propos' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'a-propos' })
    @IsString()
    slug: string;

    @ApiProperty({ example: { blocks: [] } })
    @IsJSON()
    content: any;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    metaTitle?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    metaDescription?: string;

    @ApiProperty({ default: false })
    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @ApiProperty({ default: true })
    @IsOptional()
    @IsBoolean()
    showInMenu?: boolean;

    @ApiProperty({ default: 0 })
    @IsOptional()
    @IsNumber()
    menuOrder?: number;

    @ApiProperty({ default: 'default', enum: ['default', 'fullwidth', 'landing'] })
    @IsOptional()
    @IsString()
    template?: string;
}
