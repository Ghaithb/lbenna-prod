import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findAll(skip = 0, take = 20, group?: 'client' | 'staff') {
    const where: any = {};
    if (group === 'client') {
      where.role = { in: ['CLIENT', 'B2B'] };
    } else if (group === 'staff') {
      where.role = { notIn: ['CLIENT', 'B2B'] };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isB2B: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          employeeProfile: true,
          _count: {
            select: {
              bookings: true,
              projects: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async updateRole(id: string, role: string) {
    return this.prisma.user.update({
      where: { id },
      data: { role: role as any },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        addresses: true,
        bookings: {
          include: { serviceOffer: { select: { title: true } } },
          orderBy: { bookingDate: 'desc' }
        },
        projects: {
          select: { id: true, title: true, imageUrl: true, createdAt: true },
          orderBy: { createdAt: 'desc' }
        }
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    emailVerified?: boolean;
  }) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isB2B: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async updatePassword(id: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: {
        passwordHash: hashedPassword,
      },
    });

    return { message: 'Password updated successfully' };
  }

  async delete(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }

  async getUserAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: {
        isDefault: 'desc',
      },
    });
  }

  async createAddress(userId: string, data: {
    label?: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country?: string;
    phone: string;
    isDefault?: boolean;
  }) {
    // Si c'est l'adresse par défaut, désactiver les autres
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async updateAddress(addressId: string, data: {
    label?: string;
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    isDefault?: boolean;
  }) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Si c'est l'adresse par défaut, désactiver les autres
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId: address.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  async deleteAddress(addressId: string) {
    await this.prisma.address.delete({
      where: { id: addressId },
    });

    return { message: 'Address deleted successfully' };
  }

  async toggleB2B(id: string, isB2B: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { isB2B }
    });
  }
}
