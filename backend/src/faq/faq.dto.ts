import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class CreateFaqDto {
    @IsString()
    question: string;

    @IsString()
    answer: string;

    @IsInt()
    @IsOptional()
    order?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateFaqDto {
    @IsString()
    @IsOptional()
    question?: string;

    @IsString()
    @IsOptional()
    answer?: string;

    @IsInt()
    @IsOptional()
    order?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
