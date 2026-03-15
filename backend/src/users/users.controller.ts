import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all users (Admin)' })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('group') group?: 'client' | 'staff'
  ) {
    return this.usersService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 20,
      group
    );
  }

  @Put(':id/role')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update user role (Admin)' })
  async updateRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.updateRole(id, role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  async update(
    @Param('id') id: string,
    @Body() data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      emailVerified?: boolean;
    },
  ) {
    return this.usersService.update(id, data);
  }

  @Put(':id/password')
  @ApiOperation({ summary: 'Update user password' })
  async updatePassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string },
  ) {
    return this.usersService.updatePassword(id, body.newPassword);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete user (Admin)' })
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Get(':id/addresses')
  @ApiOperation({ summary: 'Get user addresses' })
  async getUserAddresses(@Param('id') id: string) {
    return this.usersService.getUserAddresses(id);
  }

  @Post(':id/addresses')
  @ApiOperation({ summary: 'Create user address' })
  async createAddress(
    @Param('id') id: string,
    @Body() data: {
      label?: string;
      firstName: string;
      lastName: string;
      street: string;
      city: string;
      postalCode: string;
      country?: string;
      phone: string;
      isDefault?: boolean;
    },
  ) {
    return this.usersService.createAddress(id, data);
  }

  @Put('addresses/:addressId')
  @ApiOperation({ summary: 'Update address' })
  async updateAddress(
    @Param('addressId') addressId: string,
    @Body() data: {
      label?: string;
      firstName?: string;
      lastName?: string;
      street?: string;
      city?: string;
      postalCode?: string;
      country?: string;
      phone?: string;
      isDefault?: boolean;
    },
  ) {
    return this.usersService.updateAddress(addressId, data);
  }

  @Delete('addresses/:addressId')
  @ApiOperation({ summary: 'Delete address' })
  async deleteAddress(@Param('addressId') addressId: string) {
    return this.usersService.deleteAddress(addressId);
  }

  @Put(':id/b2b')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Toggle B2B Status (Admin)' })
  async toggleB2B(@Param('id') id: string, @Body() body: { isB2B: boolean }) {
    return this.usersService.toggleB2B(id, body.isB2B);
  }
}
