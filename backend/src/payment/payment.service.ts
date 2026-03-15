import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BookingsService } from '../bookings/bookings.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private bookingsService: BookingsService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey, {
        apiVersion: '2023-10-16',
      });
    }
  }

  async createPaymentIntent(bookingId: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe not configured');
    }

    const booking = await this.bookingsService.findOne(bookingId);
    if (!booking.serviceOffer) {
      throw new BadRequestException('Booking has no associated service offer for pricing');
    }

    // Convertir le montant en centimes
    const amount = Math.round(booking.serviceOffer.price * 100);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'tnd',
      metadata: {
        bookingId: booking.id,
      },
      description: `Booking #${booking.id}`,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: booking.serviceOffer.price,
    };
  }

  async confirmPayment(paymentIntentId: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe not configured');
    }

    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const bookingId = paymentIntent.metadata.bookingId;

      await this.bookingsService.updatePayment(
        bookingId,
        paymentIntent.id,
        'stripe',
      );

      return {
        success: true,
        bookingId,
        paymentIntent,
      };
    }

    return {
      success: false,
      status: paymentIntent.status,
    };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe not configured');
    }

    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      throw new BadRequestException(`Webhook Error: ${error.message}`);
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId;

    if (bookingId) {
      await this.bookingsService.updatePayment(
        bookingId,
        paymentIntent.id,
        'stripe',
      );
    }
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId;

    if (bookingId) {
      await this.bookingsService.updateStatus(
        bookingId,
        'CANCELLED' as any,
      );
    }
  }

  async createRefund(paymentIntentId: string, amount?: number) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe not configured');
    }

    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return {
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
    };
  }

  async getPaymentMethods(customerId: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe not configured');
    }

    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data;
  }

  async createCustomer(email: string, name?: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe not configured');
    }

    const customer = await this.stripe.customers.create({
      email,
      name,
    });

    return {
      customerId: customer.id,
      email: customer.email,
    };
  }
}

