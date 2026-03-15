import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) { }

  async create(createBookingDto: CreateBookingDto) {
    const bookingDate = new Date(createBookingDto.bookingDate);

    // 1-hour buffer check
    const startTime = new Date(bookingDate.getTime() - 60 * 60 * 1000);
    const endTime = new Date(bookingDate.getTime() + 60 * 60 * 1000);

    const existingConflict = await this.prisma.booking.findFirst({
      where: {
        bookingDate: {
          gt: startTime,
          lt: endTime,
        },
        status: { not: 'REJECTED' }
      }
    });

    if (existingConflict) {
      throw new BadRequestException('Ce créneau est déjà réservé ou trop proche d\'une autre réservation.');
    }

    return this.prisma.booking.create({
      data: createBookingDto,
      include: {
        serviceOffer: true,
      },
    });
  }

  async findAll(filters?: {
    status?: BookingStatus;
    serviceOfferId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.serviceOfferId) {
      where.serviceOfferId = filters.serviceOfferId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.bookingDate = {};
      if (filters.startDate) {
        where.bookingDate.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.bookingDate.lte = new Date(filters.endDate);
      }
    }

    return this.prisma.booking.findMany({
      where,
      include: {
        serviceOffer: true,
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
      orderBy: { bookingDate: 'desc' },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        serviceOffer: true,
      },
      orderBy: { bookingDate: 'desc' },
    });
  }

  async getCalendarBookings(month?: string, year?: string) {
    const now = new Date();
    const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const bookings = await this.prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        serviceOffer: true,
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
      orderBy: { bookingDate: 'asc' },
    });

    // Group by date for calendar display
    const grouped = bookings.reduce((acc, booking) => {
      const date = booking.bookingDate.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(booking);
      return acc;
    }, {} as Record<string, any[]>);

    return {
      month: targetMonth + 1,
      year: targetYear,
      bookings: grouped,
      total: bookings.length,
    };
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        serviceOffer: true,
        user: true,
      }
    });
    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }
    return booking;
  }

  async findByTransferToken(token: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { transferToken: token },
      include: {
        serviceOffer: true,
      }
    });
    if (!booking) {
      throw new NotFoundException(`Transfer link invalid or expired`);
    }
    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
    });
  }

  async updateStatus(id: string, status: BookingStatus) {
    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async updatePayment(id: string, paymentIntentId: string, paymentMethod: string) {
    return this.prisma.booking.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        paymentMethod: paymentMethod === 'stripe' ? 'ONLINE' : 'CASH',
        paidAmount: undefined, // Or get it from the service offer
      },
    });
  }

  async remove(id: string) {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
