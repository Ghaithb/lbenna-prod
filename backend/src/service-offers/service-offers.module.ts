import { Module } from '@nestjs/common';
import { ServiceOffersService } from './service-offers.service';
import { ServiceOffersController } from './service-offers.controller';

@Module({
  controllers: [ServiceOffersController],
  providers: [ServiceOffersService],
})
export class ServiceOffersModule {}
