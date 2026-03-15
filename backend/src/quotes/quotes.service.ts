import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notifications/notifications.service';
import { QuoteStatus } from '@prisma/client';

@Injectable()
export class QuotesService {
    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService
    ) { }

    async create(data: {
        userId?: string;
        clientName?: string;
        clientEmail?: string;
        items: any[];
        validUntil?: Date;
    }) {
        const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
        const taxAmount = subtotal * 0.19;
        const total = subtotal + taxAmount;

        const count = await this.prisma.quote.count();
        const year = new Date().getFullYear();
        const quoteNumber = `DEV-${year}-${String(count + 1).padStart(5, '0')}`;

        return (this.prisma.quote as any).create({
            data: {
                quoteNumber,
                userId: data.userId,
                clientName: data.clientName,
                clientEmail: data.clientEmail,
                items: data.items,
                subtotal,
                taxAmount,
                total,
                validUntil: data.validUntil || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                status: 'DRAFT',
            }
        });
    }

    async findAll() {
        return (this.prisma.quote as any).findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string) {
        return (this.prisma.quote as any).findUnique({
            where: { id }
        });
    }

    async findByNumber(quoteNumber: string) {
        return (this.prisma.quote as any).findUnique({
            where: { quoteNumber }
        });
    }

    async acceptQuote(id: string, userId?: string) {
        const quote = await this.prisma.quote.findUnique({ where: { id } });
        if (!quote) throw new NotFoundException('Quote not found');

        if (quote.status !== 'DRAFT' && quote.status !== 'SENT') {
            throw new BadRequestException('Quote cannot be accepted in current status');
        }

        const updatedQuote = await (this.prisma.quote as any).update({
            where: { id },
            data: { status: 'ACCEPTED' }
        });

        try {
            await this.notificationService.notifyQuoteAccepted(updatedQuote);
        } catch (error) {
            console.error('Failed to send notification:', error);
        }

        return updatedQuote;
    }

    async rejectQuote(id: string, reason?: string) {
        const quote = await this.prisma.quote.findUnique({ where: { id } });
        if (!quote) throw new NotFoundException('Quote not found');

        const updatedQuote = await (this.prisma.quote as any).update({
            where: { id },
            data: { status: 'REJECTED' }
        });

        try {
            await this.notificationService.notifyQuoteRejected(updatedQuote, reason);
        } catch (error) {
            console.error('Failed to send notification:', error);
        }

        return updatedQuote;
    }

    async sendQuote(id: string) {
        const quote = await this.prisma.quote.findUnique({ where: { id } });
        if (!quote) throw new NotFoundException('Quote not found');

        const updatedQuote = await (this.prisma.quote as any).update({
            where: { id },
            data: { status: 'SENT' }
        });

        try {
            await this.notificationService.sendQuoteToClient(updatedQuote);
        } catch (error) {
            console.error('Failed to send notification:', error);
        }

        return updatedQuote;
    }
}
