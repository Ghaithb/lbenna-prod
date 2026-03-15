import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';

@Module({
    imports: [PrismaModule],
    controllers: [EmployeesController, LeavesController],
    providers: [EmployeesService, LeavesService],
    exports: [EmployeesService, LeavesService],
})
export class EmployeesModule { }
