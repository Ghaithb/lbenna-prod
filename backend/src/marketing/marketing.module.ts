import { Module } from '@nestjs/common';
import { MarketingService } from './marketing_prod.service';
import { SettingsModule } from '../settings/settings.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule, SettingsModule],
    providers: [MarketingService],
    exports: [MarketingService],
})
export class MarketingModule { }
