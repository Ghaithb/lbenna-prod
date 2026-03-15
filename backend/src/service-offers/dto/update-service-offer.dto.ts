import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceOfferDto } from './create-service-offer.dto';

export class UpdateServiceOfferDto extends PartialType(CreateServiceOfferDto) { }
