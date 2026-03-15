import { IsString, IsOptional, IsNumber, IsEmail, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
    @ApiProperty({ example: 'Jane Smith' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'jane@lbenna.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ example: 'PHOTO_PRODUCTION', required: false })
    @IsOptional()
    @IsString()
    department?: string;

    @ApiProperty({ example: 'Photographer' })
    @IsString()
    position: string;

    @ApiProperty({ example: 2500.00, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    salary?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    hireDate?: Date;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    userId?: string;
}
