import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsString()
    parentId?: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsString({ each: true })
    defaultFeatures?: string[];
}
