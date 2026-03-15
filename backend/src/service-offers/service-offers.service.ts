import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceOfferDto } from './dto/create-service-offer.dto';
import { UpdateServiceOfferDto } from './dto/update-service-offer.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceOffersService {
  constructor(private prisma: PrismaService) { }

  async create(createServiceOfferDto: CreateServiceOfferDto) {
    return this.prisma.serviceOffer.create({
      data: createServiceOfferDto,
    });
  }

  async findAll(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };
    return this.prisma.serviceOffer.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const offer = await this.prisma.serviceOffer.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!offer) {
      throw new NotFoundException(`Service Offer #${id} not found`);
    }
    return offer;
  }

  async update(id: string, updateServiceOfferDto: UpdateServiceOfferDto) {
    return this.prisma.serviceOffer.update({
      where: { id },
      data: updateServiceOfferDto,
    });
  }

  async remove(id: string) {
    // Soft delete or hard delete? Let's check if it has bookings.
    // implementing basic delete for now, or soft delete by setting isActive=false
    return this.prisma.serviceOffer.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
