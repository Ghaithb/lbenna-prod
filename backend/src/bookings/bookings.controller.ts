import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my bookings (Client)' })
  getMyBookings(@Request() req) {
    return this.bookingsService.findAllByUser(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create booking (public or authenticated)' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings (Admin)' })
  findAll(
    @Query('status') status?: BookingStatus,
    @Query('serviceOfferId') serviceOfferId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.bookingsService.findAll({ status, serviceOfferId, startDate, endDate });
  }

  @Get('calendar')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get bookings for calendar view (Admin)' })
  getCalendar(
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.bookingsService.getCalendarBookings(month, year);
  }

  @Get('transfer/:token')
  @ApiOperation({ summary: 'Get booking by transfer token (Public)' })
  getByTransferToken(@Param('token') token: string) {
    return this.bookingsService.findByTransferToken(token);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking (Admin only)' })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking status (Admin only)' })
  updateStatus(@Param('id') id: string, @Body('status') status: BookingStatus) {
    return this.bookingsService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete booking (Admin only)' })
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
