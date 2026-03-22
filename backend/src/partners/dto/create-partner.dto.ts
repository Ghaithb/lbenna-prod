import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsInt, Min } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  logoUrl: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
