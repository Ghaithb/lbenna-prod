import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterAdminDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  /** Required when an admin account already exists (see ADMIN_REGISTRATION_SECRET). */
  @IsString()
  @IsOptional()
  setupSecret?: string;
}
