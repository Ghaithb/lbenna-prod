import { IsString, IsNotEmpty, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { LeaveStatus } from '@prisma/client';

export class CreateLeaveRequestDto {
    @IsString()
    @IsNotEmpty()
    employeeId: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @IsString()
    @IsNotEmpty()
    type: string; // SICK, ANNUAL, PERSONAL

    @IsString()
    @IsOptional()
    reason?: string;
}

export class UpdateLeaveStatusDto {
    @IsEnum(LeaveStatus)
    status: LeaveStatus;

    @IsString()
    @IsOptional()
    adminNotes?: string;
}
