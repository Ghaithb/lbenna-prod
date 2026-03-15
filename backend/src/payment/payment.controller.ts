import { Controller, Post, Get, Body, Param, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent')
  @ApiOperation({ summary: 'Create Stripe payment intent' })
  async createPaymentIntent(@Body() body: { orderId: string }) {
    return this.paymentService.createPaymentIntent(body.orderId);
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm payment' })
  async confirmPayment(@Body() body: { paymentIntentId: string }) {
    return this.paymentService.confirmPayment(body.paymentIntentId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.paymentService.handleWebhook(signature, req.rawBody);
  }

  @Post('refund')
  @ApiOperation({ summary: 'Create refund' })
  async createRefund(
    @Body() body: { paymentIntentId: string; amount?: number },
  ) {
    return this.paymentService.createRefund(body.paymentIntentId, body.amount);
  }

  @Get('methods/:customerId')
  @ApiOperation({ summary: 'Get customer payment methods' })
  async getPaymentMethods(@Param('customerId') customerId: string) {
    return this.paymentService.getPaymentMethods(customerId);
  }

  @Post('customer')
  @ApiOperation({ summary: 'Create Stripe customer' })
  async createCustomer(@Body() body: { email: string; name?: string }) {
    return this.paymentService.createCustomer(body.email, body.name);
  }
}
