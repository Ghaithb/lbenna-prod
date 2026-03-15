import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    deliveryUrl?: string;
    transferFileUrl?: string;
    transferToken?: string;
    previewUrls?: string[];
    downloadCount?: number;
}
