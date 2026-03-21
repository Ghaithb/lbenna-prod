import { IsString, IsNotEmpty, IsInt, Min, Max, IsBoolean, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
