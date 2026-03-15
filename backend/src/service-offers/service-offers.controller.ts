import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ServiceOffersService } from './service-offers.service';
import { CreateServiceOfferDto } from './dto/create-service-offer.dto';
import { UpdateServiceOfferDto } from './dto/update-service-offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('service-offers')
@Controller('service-offers')
export class ServiceOffersController {
  constructor(private readonly serviceOffersService: ServiceOffersService) { }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create service offer (Admin)' })
  create(@Body() createServiceOfferDto: CreateServiceOfferDto) {
    return this.serviceOffersService.create(createServiceOfferDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all service offers' })
  findAll(@Query('includeInactive') includeInactive?: string) {
    return this.serviceOffersService.findAll(includeInactive === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceOffersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service offer (Admin)' })
  update(@Param('id') id: string, @Body() updateServiceOfferDto: UpdateServiceOfferDto) {
    return this.serviceOffersService.update(id, updateServiceOfferDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete service offer (Admin)' })
  remove(@Param('id') id: string) {
    return this.serviceOffersService.remove(id);
  }
}
